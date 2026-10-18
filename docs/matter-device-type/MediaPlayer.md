A media player: power, play and pause, track skipping and remote-control keys. The name says video, but nothing in it is video-only, so an audio player can use it too.

⚠️ **Apple Home does not support this device type yet**, so an accessory using it does not appear there. Use it when building for Google Home or Alexa.

It carries three clusters:

- `onOff`: power, on or standby.
- `mediaPlayback`: the transport controls.
- `keypadInput`: remote-control keys.

**Volume and mute are not here.** In Matter they live on a separate [Speaker](matter-device-type/Speaker) endpoint. To give a player a volume control, make the accessory a [BridgedNode](matter-device-type/BridgedNode) with the player and a speaker as its parts.

#### Playback

`mediaPlayback.currentState` is the playback state: `0` playing, `1` paused, `2` not playing and `3` buffering, on `api.matter.types.MediaPlayback.PlaybackState`.

Commands arrive as `mediaPlayback.play`, `pause`, `stop`, `startOver`, `previous` and `next`, plus `skipForward` and `skipBackward`, whose request carries `deltaPositionMilliseconds`.

matter.js implements none of these, so Homebridge supplies a default. It answers each command with success, and sets `currentState` for play, pause and stop. With handlers, Homebridge records the new state once your handler succeeds. If your handler throws, the controller is told the command was invalid in the current state, and `currentState` stays as it was.

Push `currentState` yourself when playback changes on the device, for example when a track ends:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.MediaPlayback, {
  currentState: 2, // not playing
})
```

#### Remote-control keys

Key presses arrive as `keypadInput.sendKey`, with the key in `keyCode`. The codes are the HDMI-CEC ones, on `api.matter.types.KeypadInput.CecKeyCode`: for example `0` Select, `1` to `4` Up, Down, Left and Right, `9` Root menu, `13` Exit, `68` Play, `70` Pause and `69` Stop.

Without a handler, every key is answered as unsupported. With a handler, a key is answered as successful unless your handler throws.
