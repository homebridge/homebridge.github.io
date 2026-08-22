A multi-sensor: an overall air quality rating, plus PM2.5, PM10, temperature and humidity measurements.

**Apple Home currently shows only the air quality rating.** The particulate, temperature and humidity values are all published correctly and other Matter controllers can read them — but do not expect them to appear in the Home app.

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

The particulate clusters are `Pm25ConcentrationMeasurement` and `Pm10ConcentrationMeasurement`, both carrying `measuredValue` in µg/m³ — these are plain numbers, not scaled.
