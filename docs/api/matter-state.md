# State (Matter)

Handlers cover changes that start from the Home app. Changes that start anywhere else — the manufacturer's own app, a physical button, a webhook — have to be pushed to Matter by your plugin. This page covers reading and writing the state a controller sees, and the value scales Matter expects.

## Keeping state in sync

### API.matter.updateAccessoryState

> API.matter.updateAccessoryState(uuid: string, cluster: string, attributes: object, partId?: string): Promise&lt;void&gt;

Tell Matter that a value changed on the real device.

```js
// the light was switched on at the wall
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.OnOff, { onOff: true })
```

Use `api.matter.clusterNames` rather than a bare string — it gives you autocomplete for the cluster, and with it the attribute names are type-checked too.

The optional `partId` addresses one part of a [composed accessory](api/matter-platform-methods#composed-accessories), such as a single socket on a power strip:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.OnOff, { onOff: true }, 'outlet-2')
```

### API.matter.getAccessoryState

> API.matter.getAccessoryState(uuid: string, cluster: string, partId?: string): Promise&lt;object | undefined&gt;

Read back the state a controller currently sees. Returns `undefined` if the accessory or cluster is not found.

```js
const state = await api.matter.getAccessoryState(uuid, api.matter.clusterNames.OnOff)

if (state?.onOff) {
  log.info('The light is currently on')
}
```

## The cluster helpers

### API.matter.clusterNames

The cluster names, for use with `updateAccessoryState()` and `getAccessoryState()`. Prefer these constants to string literals — they are what makes attribute names type-safe.

See [Matter Clusters](api/matter-clusters) for the full list, and which device types use each one.

### API.matter.types

The enums and value types belonging to each cluster, for attributes that are not simple numbers or booleans:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.FanControl, {
  fanMode: api.matter.types.FanControl.FanMode.High,
})
```

### API.matter.clusters

Direct access to the underlying cluster definitions, for cases the helpers above do not cover. Most plugins will not need this.

## Starting values are defaults, not writes

The `clusters` object you supply when registering an accessory sets the value an attribute starts with **only when there is nothing stored for it**. Matter persists many attributes, and on every start after the first the stored value wins — what you declared is ignored.

```js
const clusters = {
  // The value on a FIRST run. On later runs, whatever was stored
  // last is what the controller sees.
  onOff: { onOff: false },
}
```

So a declared value is a starting point, never a way to force a state. If your plugin needs an accessory to come up in a particular condition, ask the device and push the answer:

```js
const isOn = await myDeviceApi.getPower()
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.OnOff, { onOff: isOn })
```

Which attributes survive a restart is decided by the Matter specification, not by Homebridge. As a rule of thumb, anything a controller can write — a name, a mode, a setpoint — is kept, while identity attributes such as the manufacturer and model are fixed and are re-applied from what your plugin supplies every time.

This is worth knowing for a second reason: it is why a name a user changed in the Home app is not overwritten when your plugin restarts, and why correcting a wrong manufacturer or model in your plugin does take effect after a restart with no re-pairing.

## Value ranges

Matter stores several common values in units of its own. None of these are rejected if you send the wrong scale — the controller simply shows the wrong number — so they are worth checking against before writing a conversion.

| Value              | Matter range                   | Convert to Matter                              |
| ------------------ | ------------------------------ | ---------------------------------------------- |
| Brightness         | `1`–`254`                      | `Math.max(1, Math.round(percent / 100 * 254))` |
| Hue                | `0`–`254` for 0–360°           | `Math.round(degrees / 360 * 254)`              |
| Saturation         | `0`–`254` for 0–100%           | `Math.round(percent / 100 * 254)`              |
| Colour temperature | mireds, roughly `147`–`454`    | `Math.round(1000000 / kelvin)`                 |
| XY colour          | `0`–`65535` for 0.0–1.0        | `Math.round(value * 65535)`                    |
| Temperature        | hundredths of °C               | `Math.round(celsius * 100)`                    |
| Battery percentage | `0`–`200`, where `200` is 100% | `Math.round(percent * 2)`                      |

Two of these catch people out more than the rest.

**Brightness starts at 1, not 0.** Zero is reserved, which is why the conversion clamps. A light at 0% is off — use the `OnOff` cluster for that, not a brightness of zero.

**Colour temperature is in mireds**, which are reciprocal — a _larger_ mired value is a _warmer_ light. The same formula converts both ways:

```js
const mireds = Math.round(1000000 / kelvin)
const kelvin = Math.round(1000000 / mireds)
```

For reference: 2700K warm white is 370 mireds, 4000K neutral is 250, and 6500K daylight is about 154.

## Reporting a battery

Battery level is carried by the `PowerSource` cluster, and two things about it catch people out.

**`batPercentRemaining` is in half-percent steps.** Matter stores it from `0` to `200`, where `200` means 100%. A battery at 75% is `150`, not `75`:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.PowerSource, {
  batPercentRemaining: Math.round(percentage * 2),
})
```

Sending a plain `0`–`100` percentage is not rejected — the controller simply shows half the real value.

**Declare only the attributes that apply.** A device with a replaceable cell should leave `batChargeState` out entirely; declaring it marks the battery as rechargeable and brings in further attributes that must then be kept up to date.

> Requires Homebridge v2.3.0 or later for anything other than a robot vacuum. Before that, `PowerSource` was only composed for `RoboticVacuumCleaner` and was silently dropped for every other device type — no warning, the battery simply never appeared on the controller.

## Stateless buttons

### API.matter.switch

Helpers for `GenericSwitch` accessories — stateless buttons and remotes, which report events rather than holding state.

`emitGesture()` is the one you usually want. It sends the whole sequence for a recognised gesture:

```js
await api.matter.switch.emitGesture(uuid, 'singlePress')
await api.matter.switch.emitGesture(uuid, 'doublePress')
await api.matter.switch.emitGesture(uuid, 'longPress')
```

`emit()` is the lower-level pair, for when you are tracking the button yourself:

```js
await api.matter.switch.emit(uuid, 'press')
await api.matter.switch.emit(uuid, 'release')
```

Both take an options object as a last argument. `position` selects which button on a multi-button remote, and `partId` selects a part of a composed accessory.
