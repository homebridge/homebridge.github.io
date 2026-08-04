A fan, with speed and mode control.

**`percentSetting` doubles as the power control.** `0` means off, and `1`–`100` means on at that speed — there is no separate on/off command to handle:

```js
const percent = request.percentSetting ?? 0
if (percent === 0) {
  await myFan.turnOff()
} else {
  await myFan.setSpeed(percent)
}
```

Two handlers are called: `fanControl.percentSettingChange` and `fanControl.fanModeChange`.

`fanMode` is an enum on `api.matter.types.FanControl.FanMode` — `Off`, `Low`, `Medium`, `High`, `On` and `Auto`. Keep it consistent with `percentSetting`: a fan reporting 75% but a mode of `Off` gives the controller contradictory information.

Declare `fanModeSequence` to describe which modes the fan actually offers, so a controller does not present a low/medium/high picker for a fan with a single speed.
