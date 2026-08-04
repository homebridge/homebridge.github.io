A water leak detector.

It uses the same `BooleanState` cluster as [ContactSensor](matter-device-type/ContactSensor), but here `stateValue` reads the natural way round: `true` means a leak **is** detected.

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.BooleanState, {
  stateValue: leakDetected,
})
```

Leak detectors are usually battery powered, so add a `PowerSource` cluster — see [reporting a battery](api/matter-state#reporting-a-battery).
