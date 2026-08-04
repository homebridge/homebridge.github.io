// Example Pump Matter plugin
//
// Homebridge configures the pump for constant-speed operation - the OnOff
// cluster switches it, and the pump's own cluster carries its reporting.

module.exports = (api) => {
  api.registerPlatform('ExamplePumpPlugin', ExamplePumpPlatform)
}

class ExamplePumpPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-pump')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExamplePumpPlatform', [{
        UUID: uuid,
        displayName: 'Example Pump',
        deviceType: api.matter.deviceTypes.Pump,
        serialNumber: 'example-pump',
        manufacturer: 'Example Co',
        model: 'Pump v1',

        clusters: {
          onOff: { onOff: false },
        },

        handlers: {
          onOff: {
            on: async () => {
              await myPumpApi.start()
            },
            off: async () => {
              await myPumpApi.stop()
            },
          },
        },
      }])
    })
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
