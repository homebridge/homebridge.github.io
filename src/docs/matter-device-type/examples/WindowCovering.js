// Example WindowCovering Matter plugin
//
// Positions are inverted and in hundredths of a percent: 0 is fully OPEN,
// 10000 is fully CLOSED. Convert deliberately in both directions.

module.exports = (api) => {
  api.registerPlatform('ExampleBlindPlugin', ExampleBlindPlatform)
}

class ExampleBlindPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-blind')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExampleBlindPlatform', [{
        UUID: uuid,
        displayName: 'Example Blind',
        deviceType: api.matter.deviceTypes.WindowCovering,
        serialNumber: 'example-blind',
        manufacturer: 'Example Co',
        model: 'Blind v1',

        clusters: {
          windowCovering: {
            currentPositionLiftPercent100ths: 10000, // fully closed
            targetPositionLiftPercent100ths: 10000,
          },
        },

        handlers: {
          windowCovering: {
            goToLiftPercentage: async ({ liftPercent100thsValue }) => {
              // invert to the "percent open" most device apis use
              const openPercent = 100 - (liftPercent100thsValue / 100)
              await myBlindApi.moveTo(openPercent)
            },
            upOrOpen: async () => {
              await myBlindApi.moveTo(100)
            },
            downOrClose: async () => {
              await myBlindApi.moveTo(0)
            },
            stopMotion: async () => {
              await myBlindApi.stop()
            },
          },
        },
      }])
    })
  }

  /**
   * Call this as the blind reports its position while moving. Updating both
   * current and target lets a controller show travel in progress.
   */
  async updatePosition(openPercent) {
    const matterValue = Math.round((100 - openPercent) * 100)
    await this.api.matter.updateAccessoryState(this.uuid, this.api.matter.clusterNames.WindowCovering, {
      currentPositionLiftPercent100ths: matterValue,
    })
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
