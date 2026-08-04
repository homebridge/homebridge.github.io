**Despite the name, this is an occupancy sensor.** The device type is called `MotionSensor` in the Homebridge API because that is what matter.js calls it, but it carries the `OccupancySensing` cluster and Apple Home and other controllers present it as occupancy.

The reading is a boolean nested one level down:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.OccupancySensing, {
  occupancy: { occupied: true },
})
```

Declare the sensing technology with `occupancySensorType` and its matching bitmap — `pir` for a passive infrared sensor, `ultrasonic`, or `physicalContact`.

Sensors have no handlers; they only push state. If the sensor is battery powered, add a `PowerSource` cluster — see [reporting a battery](api/matter-state#reporting-a-battery).
