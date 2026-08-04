# Characteristic Warnings

Homebridge prints a warning in the log when a plugin does something a HAP characteristic is unhappy about. Each one names the plugin and the characteristic, and each has a specific cause worth fixing — users are told to report these to the plugin, so they arrive as issues on your repository.

Run Homebridge in debug mode (`-D`) to get the stack trace that goes with a warning; it is logged at debug level and points at the line in your plugin that caused it.

## This plugin slows down Homebridge

A read or write handler took too long. HAP warns after **three seconds**, and gives up **six seconds after that**, marking the request as timed out.

This matters beyond your own accessories: HomeKit batches requests, so one slow handler delays the response for everything else in the bridge.

The fix is to stop doing slow work inside the handler:

- Return the cached value from [onGet](api/characteristics#characteristiconget) and refresh it in the background with [updateValue](api/characteristics#characteristicupdatevalue) when the device reports in. A plugin that pushes values this way does not need an `onGet` handler at all.
- In [onSet](api/characteristics#characteristiconset), send the command and return — do not wait for the device to confirm it finished before resolving.
- Make sure every path resolves, including error paths. A handler that throws without being caught, or a promise that never settles, produces the same warning.

If the work genuinely cannot be made fast, suggest users run your plugin as a [child bridge](https://github.com/homebridge/homebridge/wiki/Child-Bridges). That does not remove the warning, but it stops your plugin from slowing down anyone else's.

## This plugin generated a warning from the characteristic

An invalid value was set. Homebridge corrects the value and carries on, so the accessory keeps working — but the value the user sees is not the one you sent.

Common causes:

- A number outside the characteristic's range. Each characteristic's page under [Service Types](service) lists its valid range, and [setProps](api/characteristics#characteristicsetprops) can narrow it to what your device supports.
- `null` or `undefined` where the characteristic does not allow it — usually a device reading that had not arrived yet. Skip the update instead of sending an empty value.
- A value of the wrong type, such as a numeric string where a number is expected.
- Setting a characteristic the service does not declare. [getCharacteristic](api/service#servicegetcharacteristic) adds an optional characteristic silently, but anything outside the required and optional lists warns — normally a sign the service type is the wrong one for the device.

## This plugin threw an error from the characteristic

An exception escaped a `get` or `set` handler.

Throwing on purpose is fine and often correct — a [HapStatusError](api/hap#apihaphapstatuserror) is how you tell the Home app the device could not be reached. This warning is about the other kind: an unhandled exception, such as a failed network call or reading a property of something undefined.

Catch what your handler can fail on, log it with context, and re-throw a `HapStatusError` so the controller shows the accessory as not responding rather than showing a wrong state.

## This plugin is taking a long time to load

Homebridge is waiting for your plugin before it can finish starting up. This only happens with the legacy **static platform** type, which must return all its accessories before Homebridge continues.

The fix is to move to a [dynamic platform](api/platform-plugins), which registers accessories whenever they are discovered and never blocks startup. If the plugin must stay static for now, make sure every startup path — including failures — reaches its callback.
