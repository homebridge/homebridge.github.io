A smoke alarm, a carbon monoxide alarm, or one unit that does both.

**Which alarms it advertises is derived from the state you declare.** Declare `smokeState` for a smoke alarm, `coState` for a CO alarm, or both for a combined unit — do not declare an alarm the hardware does not have.

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.SmokeCoAlarm, {
  smokeState: 1, // normal is 0, warning is 1, critical is 2
})
```

The alarm states are on `api.matter.types.SmokeCoAlarm`. `expressedState` reports what the unit is currently signalling overall, and `batteryAlert` covers the low-battery warning that these devices are required to give.
