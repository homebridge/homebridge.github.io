A dedicated power and energy meter, for a device whose whole purpose is measuring — a clamp meter or a whole-home energy monitor.

For a plug that happens to measure its own consumption, you do not need this device type: declare the electrical clusters on the outlet instead and Homebridge composes the sensor for you. See [OnOffOutlet](matter-device-type/OnOffOutlet).

All values use raw Matter units — millivolts, milliamps, milliwatts and milliwatt-hours:

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.ElectricalPowerMeasurement, {
  activePower: 1_200_000, // 1.2 kW
  voltage: 230_000, // 230 V
})
```

`powerMode`, `numberOfMeasurementTypes` and `accuracy` are mandatory in the Matter specification, but Homebridge synthesises sensible defaults from the attributes you declare, so they can be left out.
