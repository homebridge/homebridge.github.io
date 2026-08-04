A smart lock.

Commands arrive as `doorLock.lockDoor` and `doorLock.unlockDoor` handlers. Each carries an optional `pinCode` in its request — a `Buffer`, present only when the controller sends one.

`lockState` is an enum, not a boolean:

| Value | Meaning                               |
| ----- | ------------------------------------- |
| `0`   | Not fully locked — jammed or part way |
| `1`   | Locked                                |
| `2`   | Unlocked                              |

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.DoorLock, {
  lockState: 1, // locked
})
```

Use `api.matter.types.DoorLock.LockState` rather than the bare numbers. `0` is genuinely useful — report it when the bolt fails to throw, rather than reporting a lock that is not actually secure.

Declare `lockType` to match the hardware (`DeadBolt`, `Magnetic`, `Mortise` and others are on `api.matter.types.DoorLock.LockType`), along with `actuatorEnabled` and `operatingMode`.
