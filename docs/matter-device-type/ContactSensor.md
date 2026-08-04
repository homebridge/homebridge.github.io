A door or window sensor.

**The value is inverted from what most people expect.** `stateValue` is `true` when the contact is **closed** (door shut) and `false` when it is **open**.

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.BooleanState, {
  stateValue: doorIsShut,
})
```

Sensors have no handlers; they only push state. If the sensor is battery powered, add a `PowerSource` cluster — see [reporting a battery](api/matter-state#reporting-a-battery).
