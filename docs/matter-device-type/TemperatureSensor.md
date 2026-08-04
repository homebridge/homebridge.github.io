**Temperature is in hundredths of a degree Celsius.** `2500` is 25.00°C.

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.TemperatureMeasurement, {
  measuredValue: Math.round(celsius * 100),
})
```

Matter has no Fahrenheit — controllers convert for display based on the user's own settings, so always send Celsius.

Declare `minMeasuredValue` and `maxMeasuredValue` to match the sensor's real range. Sending a value outside the declared range is not rejected, but the reading a controller shows will be wrong.
