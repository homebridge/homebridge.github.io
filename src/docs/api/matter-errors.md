# Errors (Matter)

When a handler throws, the command fails. What the controller is told depends on what you throw.

A plain `Error` becomes a generic failure. Throwing one of the classes on `api.matter.status` instead sends the matching Matter status code, which lets the controller say something useful — and, for a few of them, decide whether retrying is worth it. This is the Matter counterpart to [HAP's HapStatusError](api/hap#apihaphapstatuserror).

```js
const accessory = {
  // ...
  handlers: {
    onOff: {
      on: async () => {
        if (device.isUpdatingFirmware) {
          throw new api.matter.status.InvalidInState('Cannot switch on during a firmware update')
        }
        await device.turnOn()
      },
    },
  },
}
```

The message is for your logs and for whoever reads the issue report — controllers show their own wording for the status code, not your string.

## Which one to throw

| Class               | Use when                                              |
| ------------------- | ----------------------------------------------------- |
| `Busy`              | The device is already processing another operation    |
| `Timeout`           | The device or the operation timed out                 |
| `ConstraintError`   | A value is out of bounds or otherwise not acceptable  |
| `InvalidAction`     | The command is malformed, or a field value is invalid |
| `InvalidInState`    | The device's current state prevents the operation     |
| `ResourceExhausted` | The device has insufficient resources for the request |
| `PermissionDenied`  | Access control prevents the operation                 |
| `NotFound`          | The thing being addressed does not exist              |
| `Failure`           | Nothing more specific applies                         |

`Failure` is the honest fallback — reach for it rather than forcing a closer-sounding one, since a wrong status code is more misleading than a general one.

## Errors you do not raise yourself

An error coming back from the device you are bridging is usually one of these in disguise. A cloud API returning HTTP 429 is `ResourceExhausted`, a request that never answers is `Timeout`, and a 401 is `PermissionDenied`. Translating them gives a far better result than letting the raw error escape as a generic failure.

```js
try {
  await this.cloud.setBrightness(level)
} catch (err) {
  if (err.statusCode === 429) {
    throw new api.matter.status.ResourceExhausted('Rate limited by the cloud API')
  }
  throw new api.matter.status.Failure(err.message)
}
```

`api.matter.status.isMatterProtocolError(err)` tells you whether an error is already one of these, which is useful when re-throwing from a shared helper.

> Prefer `api.matter.status` to importing `MatterStatus` from the `homebridge` package. The import is a value import, so it resolves the package when your plugin file loads — which fails on installs that keep Homebridge in a separate `node_modules` tree, taking the whole plugin down with it. The `api` object your plugin already holds has no such problem.
