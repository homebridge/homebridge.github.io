// Example RoboticVacuumCleaner Matter plugin
//
// A robot vacuum is published on its own Matter server, with its own pairing
// code printed in the Homebridge log - users pair it separately from the
// bridge. You still register it exactly like any other accessory.

module.exports = (api) => {
  api.registerPlatform('ExampleVacuumPlugin', ExampleVacuumPlatform)
}

class ExampleVacuumPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-vacuum')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExampleVacuumPlatform', [{
        UUID: uuid,
        displayName: 'Example Vacuum',
        deviceType: api.matter.deviceTypes.RoboticVacuumCleaner,
        serialNumber: 'example-vacuum',
        manufacturer: 'Example Co',
        model: 'Vacuum v1',

        clusters: {
          // supportedModes describes what the vacuum can do; currentMode is the state
          rvcRunMode: {
            supportedModes: [
              { label: 'Idle', mode: 0, modeTags: [{ value: 16384 }] },
              { label: 'Cleaning', mode: 1, modeTags: [{ value: 16385 }] },
            ],
            currentMode: 0, // idle
          },
          rvcOperationalState: {
            operationalStateList: [
              { operationalStateId: 0 }, // stopped
              { operationalStateId: 1 }, // running
              { operationalStateId: 2 }, // paused
              { operationalStateId: 3 }, // error
            ],
            operationalState: 0, // stopped
          },
          powerSource: {
            status: 0, // active
            order: 0,
            description: 'Battery',
            batPercentRemaining: 200, // half-percent steps - 200 means 100%
            batChargeLevel: 0, // ok
            batReplaceability: 1, // not replaceable
          },
        },

        handlers: {
          rvcRunMode: {
            // start and stop arrive here as mode changes (idle <-> cleaning)
            changeToMode: async ({ newMode }) => {
              if (newMode === 1) {
                await myVacuumApi.startCleaning()
              } else {
                await myVacuumApi.stopCleaning()
              }
              // reflect the new activity in the operational state too
              await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.RvcOperationalState, {
                operationalState: newMode === 1 ? 1 : 0,
              })
            },
          },
          rvcOperationalState: {
            // pause, resume and goHome are commands with no single attribute
            // behind them, so the handler must update the state itself
            pause: async () => {
              await myVacuumApi.pause()
              await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.RvcOperationalState, {
                operationalState: 2, // paused
              })
            },
            resume: async () => {
              await myVacuumApi.resume()
              await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.RvcOperationalState, {
                operationalState: 1, // running
              })
            },
            goHome: async () => {
              await myVacuumApi.returnToDock()
              await api.matter.updateAccessoryState(uuid, api.matter.clusterNames.RvcRunMode, {
                currentMode: 0, // idle
              })
            },
          },
        },
      }])
    })
  }

  /**
   * Call this as the vacuum reports battery changes
   */
  async updateBattery(percent) {
    await this.api.matter.updateAccessoryState(this.uuid, this.api.matter.clusterNames.PowerSource, {
      batPercentRemaining: Math.round(percent * 2),
    })
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
