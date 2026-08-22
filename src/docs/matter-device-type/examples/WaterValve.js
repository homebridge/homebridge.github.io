// Example WaterValve Matter plugin

module.exports = (api) => {
  api.registerPlatform('ExampleValvePlugin', ExampleValvePlatform)
}

class ExampleValvePlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-valve')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExampleValvePlatform', [{
        UUID: uuid,
        displayName: 'Example Valve',
        deviceType: api.matter.deviceTypes.WaterValve,
        serialNumber: 'example-valve',
        manufacturer: 'Example Co',
        model: 'Valve v1',

        clusters: {
          valveConfigurationAndControl: {
            currentState: 0, // closed
            targetState: 0,
          },
        },

        handlers: {
          valveConfigurationAndControl: {
            open: async () => {
              await myValveApi.open()
            },
            close: async () => {
              await myValveApi.close()
            },
          },
        },
      }])
    })
  }

  /**
   * Call this when the valve confirms it has finished moving. A valve that
   * takes time to move shows targetState first and currentState on arrival.
   */
  async updateState(isOpen) {
    await this.api.matter.updateAccessoryState(this.uuid, this.api.matter.clusterNames.ValveConfigurationAndControl, {
      currentState: isOpen ? 1 : 0,
      targetState: isOpen ? 1 : 0,
    })
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
