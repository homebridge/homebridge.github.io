**The light level is on a logarithmic scale, not lux.** This is the conversion that catches people out most on any sensor:

```js
const measuredValue = Math.round(10000 * Math.log10(lux))
const lux = 10 ** (measuredValue / 10000)
```

```js
await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.IlluminanceMeasurement, {
  measuredValue: Math.round(10000 * Math.log10(lux)),
})
```

Sending raw lux produces a reading that looks plausible at small numbers and increasingly wrong as it climbs.
