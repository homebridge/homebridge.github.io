// Example Thermostat Matter plugin
//
// This example is a heat-only thermostat. The features a thermostat
// advertises are derived from the setpoints you declare - declare only the
// ones the device really has. All temperatures are hundredths of a degree
// Celsius: 2000 means 20.00 degrees.

module.exports = (api) => {
  api.registerPlatform('ExampleThermostatPlugin', ExampleThermostatPlatform)
}

class ExampleThermostatPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-thermostat')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExampleThermostatPlatform', [{
        UUID: uuid,
        displayName: 'Example Thermostat',
        deviceType: api.matter.deviceTypes.Thermostat,
        serialNumber: 'example-thermostat',
        manufacturer: 'Example Co',
        model: 'Thermostat v1',

        clusters: {
          thermostat: {
            // a heating setpoint and no cooling setpoint = a heat-only thermostat
            occupiedHeatingSetpoint: 2000, // 20.00 degrees
            systemMode: 4, // heat
          },
        },

        handlers: {
          thermostat: {
            occupiedHeatingSetpointChange: async ({ occupiedHeatingSetpoint }) => {
              await myThermostatApi.setTarget(occupiedHeatingSetpoint / 100)
            },
            systemModeChange: async ({ systemMode }) => {
              // 0 = off, 4 = heat
              await myThermostatApi.setPower(systemMode !== 0)
            },
          },
        },
      }])
    })
  }

  /**
   * Call this as the room temperature sensor reports in. localTemperature is
   * read-only - readings from your own sensor are pushed through
   * externalMeasuredIndoorTemperature instead.
   */
  async updateTemperature(celsius) {
    await this.api.matter.updateAccessoryState(this.uuid, this.api.matter.clusterNames.Thermostat, {
      externalMeasuredIndoorTemperature: Math.round(celsius * 100),
    })
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
