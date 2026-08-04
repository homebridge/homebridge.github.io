A robot vacuum, and the most involved device type Homebridge supports.

## It gets its own pairing code

**A robot vacuum is published on a Matter server of its own, not inside the bridge.** Homebridge does this for you — you register it exactly like any other accessory — but the user experience is different, and it generates support questions:

- It has its own commissioning QR code and manual pairing code, printed in the Homebridge log at startup
- The user pairs it **separately**; adding the Homebridge bridge to their home does not add the vacuum

If someone reports that every accessory appeared except the vacuum, this is almost always why.

## Command handlers must update state themselves

Most clusters update their attribute automatically once your handler resolves. The operational commands here do not, because there is no single attribute to infer — `rvcOperationalState.pause`, `resume` and `goHome` must set the state explicitly:

```js
const handlers = {
  rvcOperationalState: {
    pause: async () => {
      await myVacuum.pause()
      await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.RvcOperationalState, {
        operationalState: 2, // paused
      })
    },
  },
}
```

## Run modes, clean modes and rooms

`RvcRunMode` is what the vacuum is doing — idle, cleaning, mapping. `RvcCleanMode` is how it cleans — vacuum, mop, or both. The clean mode and service area clusters are only added when your accessory declares them, so a vacuum with a single mode does not have to pretend otherwise.

Room selection uses the `ServiceArea` cluster. It is the most involved part of the device type — the [homebridge-matter wiki](https://github.com/homebridge-plugins/homebridge-matter/wiki/Section-12-Robotic) has a complete worked example.

Vacuums are battery powered, so report the battery through the `PowerSource` cluster — remembering that `batPercentRemaining` is in [half-percent steps](api/matter-state#reporting-a-battery).
