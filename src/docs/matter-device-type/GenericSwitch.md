A stateless button or remote — a scene controller, a wireless push button, a multi-button remote.

**This device type has no handlers.** Nothing in the Home app "sets" a button. The traffic goes the other way: when the physical button is pressed, your plugin fires an event through [api.matter.switch](api/matter-state#apimatterswitch).

```js
await api.matter.switch.emitGesture(uuid, 'singlePress')
await api.matter.switch.emitGesture(uuid, 'doublePress')
await api.matter.switch.emitGesture(uuid, 'longPress')
```

`emitGesture()` sends the whole press-and-release sequence for a gesture. The lower-level `emit(uuid, 'press')` and `emit(uuid, 'release')` pair is there for when you are tracking button state yourself.

Homebridge enables the momentary switch features that back these helpers — short release, long press and multi-press — so all three gestures work without extra configuration.

#### Multi-button remotes

`numberOfPositions` **counts the released state**, so it is one more than the number of buttons: `2` for a single button, `4` for a three-button remote.

```js
const clusters = {
  switch: {
    currentPosition: 0,
    numberOfPositions: 4, // released, plus buttons 1, 2 and 3
  },
}
```

Then pass which button was pressed:

```js
await api.matter.switch.emitGesture(uuid, 'singlePress', { position: 2 })
```

Alternatively, model each button as a separate [part](api/matter-platform-methods#composed-accessories) and address it with `partId` — that gives each button its own tile rather than one switch with several positions.
