// Example GenericSwitch Matter plugin
//
// A stateless button has no handlers - nothing in the Home app sets a
// button. Your plugin fires events when the physical button is pressed.

module.exports = (api) => {
  api.registerPlatform('ExampleButtonPlugin', ExampleButtonPlatform)
}

class ExampleButtonPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-button')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExampleButtonPlatform', [{
        UUID: uuid,
        displayName: 'Example Button',
        deviceType: api.matter.deviceTypes.GenericSwitch,
        serialNumber: 'example-button',
        manufacturer: 'Example Co',
        model: 'Button v1',

        clusters: {
          switch: {
            currentPosition: 0,
            // counts the released state, so one more than the buttons:
            // 2 for a single button, 4 for a three-button remote
            numberOfPositions: 2,
          },
        },

        // no handlers - events flow from the device to the controller
      }])

      // wire the real button up to matter events
      myButtonApi.onPress(gesture => this.handlePress(gesture))
    })
  }

  /**
   * Called by your device code when the physical button is pressed.
   * emitGesture sends the whole press-and-release sequence.
   */
  async handlePress(gesture) {
    // gesture is 'singlePress', 'doublePress' or 'longPress'
    await this.api.matter.switch.emitGesture(this.uuid, gesture)
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
