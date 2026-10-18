A garage door, gate or similar closure. Before Matter defined this type, the usual stand-in was [WindowCovering](matter-device-type/WindowCovering), which drives the hardware but presents as a blind.

⚠️ **Apple Home does not support this device type yet**, so an accessory using it does not appear there. Use it when building for Google Home or Alexa, or to be ready for when Apple adds it.

#### Declare the closure state

The accessory will not register without its closure state. This is the minimum:

```js
const clusters = {
  closureControl: {
    mainState: 0, // stopped
    overallCurrentState: { position: 0, secureState: false }, // fully closed, not locked
    overallTargetState: { position: 0 },
  },
}
```

`overallCurrentState.position` is where the closure is, and `overallTargetState.position` is where it is heading:

| Value | Current position       | Target position              |
| ----- | ---------------------- | ---------------------------- |
| `0`   | Fully closed           | Move to fully closed         |
| `1`   | Fully opened           | Move to fully open           |
| `2`   | Partially opened       | Move to pedestrian position  |
| `3`   | Opened for pedestrians | Move to ventilation position |
| `4`   | Opened for ventilation | Move to signature position   |
| `5`   | At signature position  |                              |

The values are on `api.matter.types.ClosureControl.CurrentPosition` and `TargetPosition`. Homebridge enables the Positioning feature, which covers fully open and fully closed. The pedestrian, ventilation and signature positions each need their own feature. To use them, compose the cluster yourself with `api.matter.deviceRequirements.Closure`, and supply `closureControl` handlers so Homebridge's handler-calling version carries your features.

`mainState` is what the closure is doing: `0` stopped, `1` moving, `2` waiting for motion, `3` error, and so on, on `api.matter.types.ClosureControl.MainState`.

#### Handlers

Commands arrive as `closureControl.moveTo`, with the target in `position`, plus `latch` and `speed` where the closure supports them, and `closureControl.stop`.

matter.js leaves both commands unimplemented, so Homebridge supplies a default that records the move. It reports the move as finished straight away: the target and the current position are both set, and `mainState` goes back to stopped. A garage door that takes 15 seconds should correct that from its own reports. Push `mainState: 1` while it moves, then the real `overallCurrentState` when it arrives:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.ClosureControl, {
  mainState: 0, // stopped
  overallCurrentState: { position: 1, secureState: false }, // fully opened
})
```
