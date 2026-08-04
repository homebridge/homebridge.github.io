# Matter

Homebridge 2.0 can expose your plugin's accessories over [Matter](https://csa-iot.org/all-solutions/matter/) as well as HAP. A plugin does not have to choose between them — the same plugin can register HAP accessories, Matter accessories, or both, and the user decides which bridges are enabled.

Matter accessories in Homebridge are **virtual devices**. Your plugin sits between the real device and the Matter controller:

- **The physical device** — whatever your plugin already talks to, over a cloud API, HTTP, MQTT or a local protocol
- **The virtual Matter device** — the representation a Matter controller sees and sends commands to
- **Your plugin** — translating commands one way and state changes the other

### Coming from HAP

The concepts line up closely, so most of what you know transfers:

- A HAP **Accessory** is a Matter **Endpoint** — the device itself, one tile in the Home app
- A HAP **Service** is a Matter **Cluster** — a capability, such as on/off or brightness
- A HAP **Characteristic** is a Matter **Attribute** — a single value, such as `onOff` or `currentLevel`

Three differences are worth knowing before you start:

- Matter accessories are **declared up front**. You describe the whole accessory — its device type, its clusters and its handlers — in one object, rather than building it up by adding services and characteristics.
- The registration methods are **asynchronous**. `registerPlatformAccessories()` and its siblings return promises, where the HAP equivalents are synchronous.
- State is read and written through **methods**, not properties: `updateAccessoryState()` and `getAccessoryState()`, both async. HAP's `characteristic.value` has no direct equivalent.

## Checking Matter is available

### API.isMatterEnabled
> API.isMatterEnabled(): boolean

Returns `true` when Matter is enabled for the bridge your plugin is running on. Users turn it on per bridge — `bridge.matter` in `config.json` for the main bridge, or `_bridge.matter` in the platform config for a child bridge — so it may be off even on a Homebridge 2.0 install.

Because of that, `api.matter` is typed as `MatterAPI | undefined`. It is only present when Matter is actually enabled, and the type is honest about it. There are two sensible ways to deal with that.

**Optional chaining**, when your plugin should keep working either way:

```js
api.matter?.registerPlatformAccessories('homebridge-example', 'ExamplePlatform', accessories);
```

Every call becomes a no-op when Matter is off, so a plugin that also supports HAP keeps running normally.

**Guarding once**, when your plugin is Matter-only or has a distinct Matter path:

```js
if (!api.isMatterEnabled()) {
  log.info('Matter is not enabled on this bridge');
  return;
}

// past this point api.matter is guaranteed to be present
await api.matter.registerPlatformAccessories('homebridge-example', 'ExamplePlatform', accessories);
```

## Registering accessories

### API.matter.registerPlatformAccessories
> API.matter.registerPlatformAccessories(pluginIdentifier: string, platformName: string, accessories: MatterAccessory[]): Promise&lt;void&gt;

Publish one or more Matter accessories. This is the Matter counterpart to `api.registerPlatformAccessories()`, with the same arguments — it is async because an accessory is not usable until its endpoint is fully built, and awaiting it guarantees the accessory is ready for state updates.

An accessory is a single object describing what it is, what it can do, and what should happen when a controller asks it to do something:

```js
api.on('didFinishLaunching', async () => {
  const matter = api.matter;
  if (!matter) {
    return;
  }

  const uuid = matter.uuid.generate('my-light-unique-id');

  await matter.registerPlatformAccessories('homebridge-example', 'ExamplePlatform', [{
    UUID: uuid,
    displayName: 'Living Room Light',
    deviceType: matter.deviceTypes.OnOffLight,
    serialNumber: 'my-light-unique-id',
    manufacturer: 'Example Co',
    model: 'Light v1',

    // the starting state the controller sees
    clusters: {
      onOff: { onOff: false },
    },

    // what to do when the controller sends a command
    handlers: {
      onOff: {
        on: async () => {
          await myLightApi.turnOn();
        },
        off: async () => {
          await myLightApi.turnOff();
        },
      },
    },
  }]);
});
```

A handler only needs to drive the real device. Homebridge updates the cluster state for you once the handler resolves, so there is no need to write the new value back yourself.

If the handler throws, the command is reported as failed to the controller. To return a specific Matter status code instead of a generic failure, throw one of the errors on `api.matter.status`:

```js
handlers: {
  onOff: {
    on: async () => {
      if (deviceIsBusy) {
        throw new api.matter.status.Busy('Device is processing another command');
      }
      await myLightApi.turnOn();
    },
  },
}
```

### Platform.configureMatterAccessory
> configureMatterAccessory(accessory: MatterAccessory): void

The Matter equivalent of `configureAccessory`, and required for the same reason. Homebridge calls it once for every Matter accessory restored from its cache at startup, before `didFinishLaunching` fires. Track what you are given, so you can tell which accessories to re-register and which to remove because they no longer exist upstream.

```js
class ExamplePlatform {
  constructor(log, config, api) {
    this.accessories = [];
  }

  configureMatterAccessory(accessory) {
    this.accessories.push(accessory);
  }
}
```

Without it, cached accessories are restored but your plugin has no record of them, and it will try to register duplicates.

### Storing your own data

An accessory has a `context` object, persisted across restarts, for anything your plugin needs to remember about it — an upstream device id, a last-seen timestamp, whatever. It is the Matter equivalent of `PlatformAccessory.context`, and it comes back to you in `configureMatterAccessory()`.

```js
{
  UUID: uuid,
  displayName: 'Living Room Light',
  // ...
  context: { deviceId: 'abc123', room: 'living-room' },
}
```

### Answering reads yourself

By default a controller reading an attribute gets the last value you set, which is what you want almost all of the time. If a device needs to be asked at the moment of the read, supply a `getState` callback on the accessory:

```js
getState: async (cluster, attribute) => {
  if (cluster === 'onOff' && attribute === 'onOff') {
    return await myDeviceApi.isOn();
  }
},
```

Keep it quick — a controller is waiting on it. For anything slow, push updates with `updateAccessoryState()` instead and let the cached value answer reads.

### Accessories that get their own bridge

Some device types are too complex for a controller to accept inside a bridge and have to be published on a Matter server of their own. Homebridge does this for you — you register them exactly like any other accessory — but the result is visible to the user, so it is worth knowing.

Currently this applies to **`RoboticVacuumCleaner`**.

An accessory published this way gets its own port and its own commissioning QR code and manual pairing code, printed in the Homebridge log at startup. Users pair it **separately** from the bridge: adding the bridge to their home does not add the vacuum. If someone reports that everything appeared except the vacuum, this is almost always why.

### Composed accessories

An accessory can have `parts` — several endpoints under one accessory, for something like a power strip where each socket is switched independently.

```js
{
  UUID: uuid,
  displayName: 'Power Strip',
  deviceType: api.matter.deviceTypes.OnOffOutlet,
  // ...
  parts: [
    { id: 'outlet-1', displayName: 'Outlet 1', deviceType: api.matter.deviceTypes.OnOffOutlet, /* ... */ },
    { id: 'outlet-2', displayName: 'Outlet 2', deviceType: api.matter.deviceTypes.OnOffOutlet, /* ... */ },
  ],
}
```

A part's `id` is what you pass as the optional last argument to `updateAccessoryState()` and `getAccessoryState()` to address that part rather than the accessory as a whole.

### API.matter.unregisterPlatformAccessories
> API.matter.unregisterPlatformAccessories(pluginIdentifier: string, platformName: string, accessories: MatterAccessory[]): Promise&lt;void&gt;

Remove accessories that no longer exist. Only the `uuid` of each accessory is required.

```js
await api.matter.unregisterPlatformAccessories('homebridge-example', 'ExamplePlatform', [{ uuid }]);
```

### API.matter.updatePlatformAccessories
> API.matter.updatePlatformAccessories(accessories: MatterAccessory[]): Promise&lt;void&gt;

Refresh an accessory's details — display name, model, firmware revision and so on — without removing and re-adding it. Useful when the device is renamed in its own app, or reports a firmware update.

```js
accessory.displayName = 'New Name From The API';
await api.matter.updatePlatformAccessories([accessory]);
```

## Keeping state in sync

Handlers cover changes that start from the Home app. Changes that start anywhere else — the manufacturer's own app, a physical button, a webhook — have to be pushed to Matter by your plugin.

### API.matter.updateAccessoryState
> API.matter.updateAccessoryState(uuid: string, cluster: string, attributes: object, partId?: string): Promise&lt;void&gt;

Tell Matter that a value changed on the real device.

```js
// the light was switched on at the wall
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.OnOff, { onOff: true });
```

Use `api.matter.clusterNames` rather than a bare string — it gives you autocomplete for the cluster, and with it the attribute names are type-checked too.

The optional `partId` addresses one part of a composed accessory, such as a single socket on a power strip:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.OnOff, { onOff: true }, 'outlet-2');
```

### API.matter.getAccessoryState
> API.matter.getAccessoryState(uuid: string, cluster: string, partId?: string): Promise&lt;object | undefined&gt;

Read back the state a controller currently sees. Returns `undefined` if the accessory or cluster is not found.

```js
const state = await api.matter.getAccessoryState(uuid, api.matter.clusterNames.OnOff);

if (state?.onOff) {
  log.info('The light is currently on');
}
```

## Handling errors

When a handler throws, the command fails. What the controller is told depends on what you throw.

A plain `Error` becomes a generic failure. Throwing one of the classes on `api.matter.status` instead sends the matching Matter status code, which lets the controller say something useful — and, for a few of them, decide whether retrying is worth it.

```js
handlers: {
  onOff: {
    on: async () => {
      if (this.device.isUpdatingFirmware) {
        throw new api.matter.status.InvalidInState('Cannot switch on during a firmware update');
      }
      await this.device.turnOn();
    },
  },
}
```

The message is for your logs and for whoever reads the issue report — controllers show their own wording for the status code, not your string.

### Which one to throw

| Class | Use when |
| --- | --- |
| `Busy` | The device is already processing another operation |
| `Timeout` | The device or the operation timed out |
| `ConstraintError` | A value is out of bounds or otherwise not acceptable |
| `InvalidAction` | The command is malformed, or a field value is invalid |
| `InvalidInState` | The device's current state prevents the operation |
| `ResourceExhausted` | The device has insufficient resources for the request |
| `PermissionDenied` | Access control prevents the operation |
| `NotFound` | The thing being addressed does not exist |
| `Failure` | Nothing more specific applies |

`Failure` is the honest fallback — reach for it rather than forcing a closer-sounding one, since a wrong status code is more misleading than a general one.

### Errors you do not raise yourself

An error coming back from the device you are bridging is usually one of these in disguise. A cloud API returning HTTP 429 is `ResourceExhausted`, a request that never answers is `Timeout`, and a 401 is `PermissionDenied`. Translating them gives a far better result than letting the raw error escape as a generic failure.

```js
try {
  await this.cloud.setBrightness(level);
} catch (err) {
  if (err.statusCode === 429) {
    throw new api.matter.status.ResourceExhausted('Rate limited by the cloud API');
  }
  throw new api.matter.status.Failure(err.message);
}
```

`api.matter.status.isMatterProtocolError(err)` tells you whether an error is already one of these, which is useful when re-throwing from a shared helper.

> Prefer `api.matter.status` to importing `MatterStatus` from the `homebridge` package. The import is a value import, so it resolves the package when your plugin file loads — which fails on installs that keep Homebridge in a separate `node_modules` tree, taking the whole plugin down with it. The `api` object your plugin already holds has no such problem.

## What you can build

### API.matter.deviceTypes

The device types Homebridge supports, by friendly name — `OnOffLight`, `DimmableLight`, `ColorTemperatureLight`, `Thermostat`, `ContactSensor`, `WaterValve` and more. One of these goes in an accessory's `deviceType`.

See [Device Types](matter-device-type) for the full list - every device type has its own page, with the clusters each one supports.

Matter defines many more device types than Homebridge currently exposes. The list is deliberately limited to those the Home app understands, since a device type a controller does not recognise produces an accessory that never appears.

### API.matter.clusterNames

The cluster names, for use with `updateAccessoryState()` and `getAccessoryState()`. Prefer these constants to string literals — they are what makes attribute names type-safe.

See [Matter Clusters](api/matter-clusters) for the full list, and which device types use each one.

### API.matter.types

The enums and value types belonging to each cluster, for attributes that are not simple numbers or booleans:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.FanControl, {
  fanMode: api.matter.types.FanControl.FanMode.High,
});
```

### API.matter.clusters

Direct access to the underlying cluster definitions, for cases the helpers above do not cover. Most plugins will not need this.

## Value ranges

Matter stores several common values in units of its own. None of these are rejected if you send the wrong scale — the controller simply shows the wrong number — so they are worth checking against before writing a conversion.

| Value | Matter range | Convert to Matter |
| --- | --- | --- |
| Brightness | `1`–`254` | `Math.max(1, Math.round(percent / 100 * 254))` |
| Hue | `0`–`254` for 0–360° | `Math.round(degrees / 360 * 254)` |
| Saturation | `0`–`254` for 0–100% | `Math.round(percent / 100 * 254)` |
| Colour temperature | mireds, roughly `147`–`454` | `Math.round(1000000 / kelvin)` |
| XY colour | `0`–`65535` for 0.0–1.0 | `Math.round(value * 65535)` |
| Temperature | hundredths of °C | `Math.round(celsius * 100)` |
| Battery percentage | `0`–`200`, where `200` is 100% | `Math.round(percent * 2)` |

Two of these catch people out more than the rest.

**Brightness starts at 1, not 0.** Zero is reserved, which is why the conversion clamps. A light at 0% is off — use the `OnOff` cluster for that, not a brightness of zero.

**Colour temperature is in mireds**, which are reciprocal — a *larger* mired value is a *warmer* light. The same formula converts both ways:

```js
const mireds = Math.round(1000000 / kelvin);
const kelvin = Math.round(1000000 / mireds);
```

For reference: 2700K warm white is 370 mireds, 4000K neutral is 250, and 6500K daylight is about 154.

## Reporting a battery

Battery level is carried by the `PowerSource` cluster, and two things about it catch people out.

**`batPercentRemaining` is in half-percent steps.** Matter stores it from `0` to `200`, where `200` means 100%. A battery at 75% is `150`, not `75`:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.PowerSource, {
  batPercentRemaining: Math.round(percentage * 2),
});
```

Sending a plain `0`–`100` percentage is not rejected — the controller simply shows half the real value.

**Declare only the attributes that apply.** A device with a replaceable cell should leave `batChargeState` out entirely; declaring it marks the battery as rechargeable and brings in further attributes that must then be kept up to date.

> Requires Homebridge v2.3.0 or later for anything other than a robot vacuum. Before that, `PowerSource` was only composed for `RoboticVacuumCleaner` and was silently dropped for every other device type — no warning, the battery simply never appeared on the controller.

### API.matter.switch

Helpers for `GenericSwitch` accessories — stateless buttons and remotes, which report events rather than holding state.

`emitGesture()` is the one you usually want. It sends the whole sequence for a recognised gesture:

```js
await api.matter.switch.emitGesture(uuid, 'singlePress');
await api.matter.switch.emitGesture(uuid, 'doublePress');
await api.matter.switch.emitGesture(uuid, 'longPress');
```

`emit()` is the lower-level pair, for when you are tracking the button yourself:

```js
await api.matter.switch.emit(uuid, 'press');
await api.matter.switch.emit(uuid, 'release');
```

Both take an options object as a last argument. `position` selects which button on a multi-button remote, and `partId` selects a part of a composed accessory.

## Telling users your plugin supports Matter

Add the relevant keywords to your plugin's `package.json` so the Homebridge UI can show which transports it supports, and offer the right bridge options when a user sets it up:

```json
{
  "keywords": [
    "homebridge-plugin",
    "supports-hap",
    "supports-matter"
  ]
}
```

A plugin with neither keyword is treated as HAP-only, so existing plugins need no change.
