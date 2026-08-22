**Humidity is in hundredths of a percent.** `5500` is 55.00%.

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.RelativeHumidityMeasurement, {
  measuredValue: Math.round(percent * 100),
})
```

Sending a plain `0`–`100` percentage is not rejected — the controller simply shows a humidity near zero.
