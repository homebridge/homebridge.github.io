// Example RoomAirConditioner Matter plugin
//
// An air conditioner combines a thermostat with fan control. Homebridge
// enables both heating and cooling on this device type, so a reverse-cycle
// unit works and a cooling-only unit leaves the heating side at defaults.
// Temperatures are hundredths of a degree Celsius.

module.exports = (api) => {
  api.registerPlatform('ExampleAirConPlugin', ExampleAirConPlatform)
}

class ExampleAirConPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-aircon')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExampleAirConPlatform', [{
        UUID: uuid,
        displayName: 'Example Air Conditioner',
        deviceType: api.matter.deviceTypes.RoomAirConditioner,
        serialNumber: 'example-aircon',
        manufacturer: 'Example Co',
        model: 'AC v1',

        clusters: {
          onOff: { onOff: false },
          thermostat: {
            occupiedCoolingSetpoint: 2400, // 24.00 degrees
            systemMode: 3, // cool
          },
          fanControl: {
            fanMode: 0, // off
            percentSetting: 0,
          },
        },

        handlers: {
          onOff: {
            on: async () => {
              await myAirConApi.turnOn()
            },
            off: async () => {
              await myAirConApi.turnOff()
            },
          },
          thermostat: {
            occupiedCoolingSetpointChange: async ({ occupiedCoolingSetpoint }) => {
              await myAirConApi.setTarget(occupiedCoolingSetpoint / 100)
            },
            systemModeChange: async ({ systemMode }) => {
              await myAirConApi.setMode(systemMode)
            },
          },
          fanControl: {
            // percentSetting doubles as fan power: 0 is off, 1-100 is a speed
            percentSettingChange: async ({ percentSetting }) => {
              await myAirConApi.setFanSpeed(percentSetting ?? 0)
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
