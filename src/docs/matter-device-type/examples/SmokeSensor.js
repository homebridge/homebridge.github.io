// Example SmokeSensor Matter plugin
//
// Which alarms the device advertises is derived from the state you declare:
// smokeState for a smoke alarm, coState for a CO alarm, or both.

module.exports = (api) => {
  api.registerPlatform('ExampleSmokeAlarmPlugin', ExampleSmokeAlarmPlatform)
}

class ExampleSmokeAlarmPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-smoke-alarm')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExampleSmokeAlarmPlatform', [{
        UUID: uuid,
        displayName: 'Example Smoke Alarm',
        deviceType: api.matter.deviceTypes.SmokeSensor,
        serialNumber: 'example-smoke-alarm',
        manufacturer: 'Example Co',
        model: 'Alarm v1',

        clusters: {
          smokeCoAlarm: {
            smokeState: 0, // normal
            expressedState: 0, // normal
            batteryAlert: 0, // normal
          },
          powerSource: {
            status: 0,
            order: 0,
            description: 'Battery',
            batPercentRemaining: 200, // half-percent steps - 200 means 100%
          },
        },

        // sensors have no handlers - they only push state
      }])

      myAlarmApi.onSmokeChange(detected => this.updateSmoke(detected))
    })
  }

  /**
   * Call this when the detector reports a change. 0 normal, 1 warning,
   * 2 critical - the values are on api.matter.types.SmokeCoAlarm.
   */
  async updateSmoke(detected) {
    const state = detected ? 2 : 0
    await this.api.matter.updateAccessoryState(this.uuid, this.api.matter.clusterNames.SmokeCoAlarm, {
      smokeState: state,
      expressedState: state,
    })
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
