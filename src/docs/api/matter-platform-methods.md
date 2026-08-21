# Platform Methods (Matter)

These are the methods a [platform plugin](api/platform-plugins) uses to publish and manage accessories over Matter. They are the Matter counterparts to the [HAP platform methods](api/hap-platform-methods).

## Registering accessories

### API.matter.registerPlatformAccessories

> API.matter.registerPlatformAccessories(pluginIdentifier: string, platformName: string, accessories: MatterAccessory[]): Promise&lt;void&gt;

Publish one or more Matter accessories. This is the Matter counterpart to `api.registerPlatformAccessories()`, with the same arguments — it is async because an accessory is not usable until its endpoint is fully built, and awaiting it guarantees the accessory is ready for state updates.

An accessory is a single object describing what it is, what it can do, and what should happen when a controller asks it to do something:

```js
api.on('didFinishLaunching', async () => {
  const matter = api.matter
  if (!matter) {
    return
  }

  const uuid = matter.uuid.generate('my-light-unique-id')

  await matter.registerPlatformAccessories('homebridge-example', 'ExamplePlatform', [{
    UUID: uuid,
    displayName: 'Living Room Light',
    deviceType: matter.deviceTypes.OnOffLight,
    serialNumber: 'my-light-unique-id',
    manufacturer: 'Example Co',
    model: 'Light v1',

    // the state to start from, when nothing is stored yet
    // (see State (Matter) - a stored value wins on later runs)
    clusters: {
      onOff: { onOff: false },
    },

    // what to do when the controller sends a command
    handlers: {
      onOff: {
        on: async () => {
          await myLightApi.turnOn()
        },
        off: async () => {
          await myLightApi.turnOff()
        },
      },
    },
  }])
})
```

A handler only needs to drive the real device. Homebridge updates the cluster state for you once the handler resolves, so there is no need to write the new value back yourself.

That automatic update only applies to handlers whose command targets an attribute — `on`, `off`, `moveToLevelWithOnOff` and the like. Two cases still need a manual [`updateAccessoryState()`](api/matter-state#apimatterupdateaccessorystate):

- **Action commands with no single attribute**, such as a vacuum's `pause` or `resume` — nothing can be inferred, so update the operational state yourself.
- **Side effects on other attributes** — if turning a light on also resets its brightness to 100%, update the `levelControl` cluster too; only the attribute behind the command is updated automatically.

If the handler throws, the command is reported as failed to the controller. To return a specific Matter status code instead of a generic failure, throw one of the errors on `api.matter.status` — see [Errors](api/matter-errors).

### API.matter.deviceTypes

The device types Homebridge supports, by friendly name — `OnOffLight`, `DimmableLight`, `ColorTemperatureLight`, `Thermostat`, `ContactSensor`, `WaterValve` and more. One of these goes in an accessory's `deviceType`.

See [Device Types](matter-device-type) for the full list - every device type has its own page, with the clusters each one supports.

Matter defines many more device types than Homebridge currently exposes. The list is deliberately limited to those the Home app understands, since a device type a controller does not recognise produces an accessory that never appears.

### API.matter.deviceRequirements

*Requires Homebridge v2.4.0 or later.*

The matter.js "requirements" behind the feature-gated device types, keyed to match `deviceTypes`. Homebridge normally chooses a cluster's features from the state an accessory declares, which is right for almost every device. When the right combination cannot be inferred — a thermostat that heats and cools but has no auto mode is the classic case — compose the cluster yourself, and Homebridge uses your feature choices as given:

```typescript
deviceType: api.matter.deviceTypes.Thermostat.with(
  api.matter.deviceRequirements.Thermostat.ThermostatServer.with('Heating', 'Cooling'),
)
```

Once you compose a cluster yourself, you own all of its feature choices for that cluster — Homebridge adds none for you, so declared state must match the features you picked. The full guide, with the possibilities per device type: [Customising Features](https://github.com/homebridge-plugins/homebridge-matter/wiki/Customising-Features) in the homebridge-matter wiki.

### Platform.configureMatterAccessory

> configureMatterAccessory(accessory: MatterAccessory): void

The Matter equivalent of `configureAccessory`, and required for the same reason. Homebridge calls it once for every Matter accessory restored from its cache at startup, before `didFinishLaunching` fires. Track what you are given, so you can tell which accessories to re-register and which to remove because they no longer exist upstream.

```js
class ExamplePlatform {
  constructor(log, config, api) {
    this.accessories = []
  }

  configureMatterAccessory(accessory) {
    this.accessories.push(accessory)
  }
}
```

Without it, cached accessories are restored but your plugin has no record of them, and it will try to register duplicates.

### Storing your own data

An accessory has a `context` object, persisted across restarts, for anything your plugin needs to remember about it — an upstream device id, a last-seen timestamp, whatever. It is the Matter equivalent of `PlatformAccessory.context`, and it comes back to you in `configureMatterAccessory()`.

```js
const accessory = {
  UUID: uuid,
  displayName: 'Living Room Light',
  // ...
  context: { deviceId: 'abc123', room: 'living-room' },
}
```

### Answering reads yourself

By default a controller reading an attribute gets the last value you set, which is what you want almost all of the time. If a device needs to be asked at the moment of the read, supply a `getState` callback on the accessory:

```js
const accessory = {
  // ...
  getState: async (cluster, attribute) => {
    if (cluster === 'onOff' && attribute === 'onOff') {
      return await myDeviceApi.isOn()
    }
  },
}
```

Keep it quick — a controller is waiting on it. For anything slow, push updates with `updateAccessoryState()` instead and let the cached value answer reads.

### Accessories that get their own bridge

Some device types are too complex for a controller to accept inside a bridge and have to be published on a Matter server of their own. Homebridge does this for you — you register them exactly like any other accessory — but the result is visible to the user, so it is worth knowing.

Currently this applies to **`RoboticVacuumCleaner`**.

An accessory published this way gets its own port and its own commissioning QR code and manual pairing code, printed in the Homebridge log at startup. Users pair it **separately** from the bridge: adding the bridge to their home does not add the vacuum. If someone reports that everything appeared except the vacuum, this is almost always why.

### Composed accessories

An accessory can have `parts` — several endpoints under one accessory, for something like a power strip where each socket is switched independently.

```js
const accessory = {
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
await api.matter.unregisterPlatformAccessories('homebridge-example', 'ExamplePlatform', [{ uuid }])
```

### API.matter.updatePlatformAccessories

> API.matter.updatePlatformAccessories(accessories: MatterAccessory[]): Promise&lt;void&gt;

Refresh an accessory's details — display name, model, firmware revision and so on — without removing and re-adding it. Useful when the device is renamed in its own app, or reports a firmware update.

```js
accessory.displayName = 'New Name From The API'
await api.matter.updatePlatformAccessories([accessory])
```
