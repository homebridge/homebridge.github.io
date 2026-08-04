The simplest light: on or off, nothing else. If the light can also be dimmed, use [DimmableLight](matter-device-type/DimmableLight) instead — a controller only offers a brightness slider when the device type says the light has one.

Power commands arrive as `onOff.on` and `onOff.off` handlers. Homebridge writes the new `onOff` value into the cluster state once your handler resolves, so there is no need to push it back yourself.
