# Controllers

Some HomeKit features are too involved to build from services and characteristics by hand — they need several services working together, a private protocol, or state that survives a restart. HAP provides these as **controllers**: you create one, attach it to the accessory, and it builds and manages the services itself.

```js
accessory.configureController(controller)
```

`accessory.removeController(controller)` detaches one again.

Controllers persist their own state with the accessory, so anything a controller negotiated with HomeKit survives a Homebridge restart without your plugin storing it.

The controllers available are:

- **[Camera and Doorbell](api/cameras)** — live streaming, snapshots and HomeKit Secure Video
- **Adaptive Lighting** — colour temperature that follows the time of day
- **Remote** — the Apple TV remote in Control Center

## Adaptive Lighting

Adaptive Lighting makes a light warm in the evening and cool during the day, following a schedule HomeKit works out. A Home Hub sends the schedule for the next 24 hours, and the light follows the curve.

The lightbulb service must already have **Brightness** and **ColorTemperature** characteristics — the controller asserts on both, so adding it to a plain on/off light throws at startup. Hue and Saturation may also be present for a colour light.

```js
const adaptiveLightingController = new this.api.hap.AdaptiveLightingController(lightbulbService)

accessory.configureController(adaptiveLightingController)
```

There are two modes, and choosing the right one matters.

### Automatic mode

The default. The controller runs the whole schedule for you: every 60 seconds it works out the colour temperature for that moment and calls the `set` handler on the ColorTemperature characteristic, exactly as though the user had changed it in the Home app. It also adjusts for the current brightness, and turns Adaptive Lighting off when it sees a manual write to ColorTemperature, Hue or Saturation.

Four things to know:

- **A write every 60 seconds.** Each transition step is a real `set`, so the handler needs to be cheap. If it talks to a cloud API, this is 1,440 calls a day per light.
- **Keep the cached brightness fresh.** Each step depends on the current brightness value, and the controller does not call your `get` handler for it. Push changes with [updateValue](api/characteristics#characteristicupdatevalue) whenever the brightness changes on the device.
- **It keeps running when the light is off.** The `set` handler is still called on the schedule, so handle the light being unreachable or off without producing errors.
- **Changes made outside HomeKit are invisible to it.** If someone changes the colour in the manufacturer's app or on the wall, you must call `disableAdaptiveLighting()` yourself — the controller can only detect writes arriving through HomeKit.

If your light exposes Hue and Saturation as well as ColorTemperature, keep the two representations in step — but use `updateValue`, never [setValue](api/characteristics#characteristicsetvalue). A `setValue` counts as a manual write and switches Adaptive Lighting off. The helper `api.hap.ColorUtils.colorTemperatureToHueAndSaturation()` does the conversion.

### Manual mode

Preferred when the device can run transitions itself — a Zigbee bulb, for instance, can be handed the curve and execute it locally, with no per-minute traffic from Homebridge at all.

```js
const adaptiveLightingController = new this.api.hap.AdaptiveLightingController(lightbulbService, {
  controllerMode: this.api.hap.AdaptiveLightingControllerMode.MANUAL,
})
```

The controller still handles setup with HomeKit and still saves the schedule across restarts. What you take on is running the transition:

- Listen for the controller's `update` event, which fires when Adaptive Lighting is switched on, when a Home Hub sends a fresh 24-hour schedule, and when the saved schedule is restored at startup.
- Read the schedule with `getAdaptiveLightingTransitionCurve()`, along with `getAdaptiveLightingStartTimeOfTransition()` and the update and notify intervals, and send it to the device.
- Adjust the colour temperature when brightness changes, using each curve entry's `brightnessAdjustmentFactor`.
- Call `disableAdaptiveLighting()` when the colour is changed manually.
- Handle the `disable` event, since HomeKit can also switch Adaptive Lighting off directly.

`isAdaptiveLightingActive()` tells you whether it is currently on.

## Remote

`RemoteController` implements the Apple TV remote that appears in Control Center — the directional pad, playback controls and the audio channel for Siri. It is a large, specialised API used by a small number of plugins.

If you are building one, work from the [HAP-NodeJS reference](https://developers.homebridge.io/HAP-NodeJS/modules.html), which documents the controller, its events and the button types in full.
