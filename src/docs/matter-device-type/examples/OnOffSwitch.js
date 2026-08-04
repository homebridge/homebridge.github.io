// Example OnOffSwitch Matter plugin
//
// A switch with real state - a wall switch controlling a load. For a
// stateless button or remote, use GenericSwitch instead.

module.exports = (api) => {
  api.registerPlatform('ExampleSwitchPlugin', ExampleSwitchPlatform)
}

class ExampleSwitchPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-switch')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExampleSwitchPlatform', [{
        UUID: uuid,
        displayName: 'Example Switch',
        deviceType: api.matter.deviceTypes.OnOffSwitch,
        serialNumber: 'example-switch',
        manufacturer: 'Example Co',
        model: 'Switch v1',

        clusters: {
          onOff: { onOff: false },
        },

        handlers: {
          onOff: {
            on: async () => {
              await mySwitchApi.turnOn()
            },
            off: async () => {
              await mySwitchApi.turnOff()
            },
          },
        },
      }])
    })
  }

  /**
   * Call this when the switch is toggled at the wall
   */
  async syncFromDevice(isOn) {
    await this.api.matter.updateAccessoryState(this.uuid, this.api.matter.clusterNames.OnOff, {
      onOff: isOn,
    })
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
