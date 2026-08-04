# Best Practices

These apply whichever protocol your plugin publishes over. Where HAP and Matter differ, both are shown.

### Only register what the cache did not restore

Homebridge restores cached accessories itself, before `didFinishLaunching` fires — `configureAccessory()` and `configureMatterAccessory()` hand them to you. Registering an accessory the cache already restored creates a duplicate. Track what you were handed, then register only what is new. See [the startup lifecycle](api/platform-plugins#the-startup-lifecycle).

### Compare before updating

Push an update only when the value actually changed. Redundant updates flood the bridge and the controllers behind it, and make update loops possible when a device echoes state back.

```js
if (isOn !== lastKnownState) {
  service.updateCharacteristic(api.hap.Characteristic.On, isOn)
}
```

The same rule applies to Matter's [`updateAccessoryState()`](api/matter-state#apimatterupdateaccessorystate).

### Prefer events over polling

If the device or its API offers push updates — MQTT, WebSocket, webhooks, a local event stream — use them, and keep polling as the fallback. Events give instant updates in the Home app, and far fewer requests against APIs with rate limits. When polling is the only option, pick the slowest interval that still feels responsive.

### Throw from handlers when the device call fails

Swallowing an error in a set handler tells the controller the command worked. The Home app then shows the wrong state, and the user gets no hint anything failed. Log the error, then re-throw it — ideally as the protocol's own status error, which lets the controller say something useful:

- HAP: throw a [HapStatusError](api/hap#apihaphapstatuserror)
- Matter: throw one of the [api.matter.status classes](api/matter-errors)

### Show unavailability honestly

When a device cannot be reached, say so rather than serving stale state:

- Over HAP, update a primary characteristic with an `Error` object to mark the accessory "No Response" — see [Service.updateCharacteristic](api/service#serviceupdatecharacteristic) — and update it with a real value once the device returns.
- Over Matter, throw `api.matter.status` errors from handlers while the device is unreachable.

### Validate and convert values

Both protocols store values in their own scales, and neither rejects a value in the wrong one — the controller simply shows a wrong number. Clamp to the valid range and convert deliberately. The Matter scales are listed under [value ranges](api/matter-state#value-ranges); for HAP, each characteristic's page lists its range.

### Clean up on shutdown

The `shutdown` event is the place to clear timers and close connections — see [the startup lifecycle](api/platform-plugins#the-startup-lifecycle). A plugin that leaves sockets open or intervals running can stop a Homebridge restart from completing cleanly.

### Log for the person reading the log later

Include which device a line is about, and which direction the change travelled — a command from the Home app, or a change observed on the device. Most support requests are answered from a log, and "Turning on" with no device name answers nothing. Keep noisy per-update lines at [debug level](api/log).

### Declare the transports you support

Add the `supports-hap` / `supports-matter` keywords to your `package.json` so the Homebridge UI can present your plugin correctly — see [Telling users your plugin supports Matter](api/matter#telling-users-your-plugin-supports-matter).
