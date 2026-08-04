// Example ElectricalSensor Matter plugin
//
// A dedicated power and energy meter. For a plug that measures its own
// consumption, declare these clusters on the outlet instead - Homebridge
// composes the sensor for you. All values are raw Matter units: millivolts,
// milliamps, milliwatts and milliwatt-hours.

module.exports = (api) => {
  api.registerPlatform('ExampleMeterPlugin', ExampleMeterPlatform)
}

class ExampleMeterPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-meter')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExampleMeterPlatform', [{
        UUID: uuid,
        displayName: 'Example Energy Meter',
        deviceType: api.matter.deviceTypes.ElectricalSensor,
        serialNumber: 'example-meter',
        manufacturer: 'Example Co',
        model: 'Meter v1',

        clusters: {
          electricalPowerMeasurement: {
            voltage: 230_000, // 230 V
            activeCurrent: 0, // mA
            activePower: 0, // mW
          },
          electricalEnergyMeasurement: {
            cumulativeEnergyImported: { energy: 0 }, // mWh
          },
        },
      }])

      // power readings - update as often as the meter reports
      myMeterApi.onReading(reading => this.updatePower(reading))

      // energy totals - keep to a sane cadence, roughly once a minute
      this.energyInterval = setInterval(() => this.updateEnergy(), 60_000)
    })

    api.on('shutdown', () => clearInterval(this.energyInterval))
  }

  async updatePower(reading) {
    await this.api.matter.updateAccessoryState(this.uuid, this.api.matter.clusterNames.ElectricalPowerMeasurement, {
      activePower: Math.round(reading.watts * 1000),
      activeCurrent: Math.round(reading.amps * 1000),
    })
  }

  async updateEnergy() {
    const totalWattHours = await myMeterApi.getTotalEnergy()
    await this.api.matter.updateAccessoryState(this.uuid, this.api.matter.clusterNames.ElectricalEnergyMeasurement, {
      cumulativeEnergyImported: { energy: Math.round(totalWattHours * 1000) },
    })
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
