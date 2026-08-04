A smart plug. It behaves exactly like [OnOffLight](matter-device-type/OnOffLight) — `onOff.on` and `onOff.off` handlers — but presents as a plug rather than a light.

#### Reporting power and energy

From Homebridge 2.2.0, an outlet can also report live power draw and energy totals. Declare `electricalPowerMeasurement` and/or `electricalEnergyMeasurement` state and Homebridge does the rest: it detects the clusters, adds the `ElectricalSensor` device type to the endpoint, and fills in the accuracy metadata Matter requires.

```js
const clusters = {
  onOff: { onOff: false },
  electricalPowerMeasurement: {
    voltage: 230_000, // 230 V, in millivolts
    activeCurrent: 0, // milliamps
    activePower: 0, // milliwatts
  },
  electricalEnergyMeasurement: {
    cumulativeEnergyImported: { energy: 0 }, // milliwatt-hours
  },
}
```

**Everything is in raw Matter units** — millivolts, milliamps, milliwatts and milliwatt-hours. A 60W load is `activePower: 60_000`. Set a measurement to `null` to mean "no reading available right now".

Which energy features the cluster advertises is worked out from the attributes you declare, so declaring only `cumulativeEnergyImported` gives the common shape of a meter reporting total consumption.

Keep energy totals to a sensible cadence — roughly once a minute. Each update emits a measurement event to every subscribed controller. Power readings can be updated as often as the device reports them.

Controllers that understand these clusters, such as Apple Home on iOS 27 and later, then show power and energy for the outlet.
