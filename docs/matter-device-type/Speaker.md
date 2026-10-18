A speaker's volume and mute. In Matter these are their own endpoint, which is why a [MediaPlayer](matter-device-type/MediaPlayer) has no volume control. Make the accessory a [BridgedNode](matter-device-type/BridgedNode) with both as parts, to give a player a volume.

⚠️ **Apple Home does not support this device type yet**, so an accessory using it does not appear there. Use it when building for Google Home or Alexa.

#### OnOff is mute

**On this device type `onOff` is the mute switch, not power.** `true` means sound is on (not muted), and `false` means muted. So `onOff.on` arrives when the user unmutes, and `onOff.off` when they mute.

#### LevelControl is volume

The volume is `levelControl.currentLevel`, and **it runs from 1 to 254, not 0 to 100**, the same as a light's brightness. Convert on the way in and out:

```js
const percent = Math.round((level / 254) * 100)
const level = Math.max(1, Math.round((percent / 100) * 254))
```

A volume change can arrive as `levelControl.moveToLevel` or as `levelControl.moveToLevelWithOnOff`, depending on the controller, so handle both. The `WithOnOff` form also changes the mute: raising the level unmutes the speaker, and taking it to the minimum mutes it.

```js
const clusters = {
  onOff: { onOff: true }, // not muted
  levelControl: { currentLevel: 127 }, // about half volume
}
```
