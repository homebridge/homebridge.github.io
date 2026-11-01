A multi-sensor: an overall air quality rating, plus PM2.5, PM10, temperature and humidity measurements.

**Apple Home currently shows only the air quality rating.** Other Matter controllers can read the particulate, temperature and humidity values, but do not expect them to appear in the Home app.

The readings are optional clusters, and **need Homebridge v2.5.1 or later**. From that version Homebridge adds each one you declare state for when the accessory registers. Before it, they were left off the device without an error, and every later update failed.

`airQuality` is an enum from `0` to `6`:

| Value | Meaning        |
| ----- | -------------- |
| `0`   | Unknown        |
| `1`   | Good           |
| `2`   | Fair           |
| `3`   | Moderate       |
| `4`   | Poor           |
| `5`   | Very poor      |
| `6`   | Extremely poor |

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.AirQuality, {
  airQuality: 1, // good
})
```

The particulate clusters are `Pm25ConcentrationMeasurement` and `Pm10ConcentrationMeasurement`, both carrying `measuredValue` in µg/m³ — these are plain numbers, not scaled. Ozone, NO₂, CO, CO₂, formaldehyde, PM1, TVOC and radon follow the same shape.

Each one needs a unit, and Homebridge leaves out a reading without one (with a warning), because there is no safe unit to assume:

```js
const clusters = {
  airQuality: { airQuality: 1 },
  pm25ConcentrationMeasurement: {
    measuredValue: 12,
    minMeasuredValue: 0,
    maxMeasuredValue: 1000,
    measurementUnit: 4, // 0 = ppm, 1 = ppb, 3 = mg/m³, 4 = µg/m³
    measurementMedium: 0, // 0 = air, assumed when left out
  },
}
```

A sensor that reports a level rather than a number can declare `levelValue` instead, from `0` (unknown) to `4` (critical).
