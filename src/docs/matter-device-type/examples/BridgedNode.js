// Example BridgedNode Matter plugin
//
// BridgedNode is a container for a composed accessory - one accessory made
// of several endpoints. This example is a two-socket power strip: one tile
// in the Home app, expandable into a tile per socket.

module.exports = (api) => {
  api.registerPlatform('ExamplePowerStripPlugin', ExamplePowerStripPlatform)
}

class ExamplePowerStripPlatform {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge')
        return
      }

      const uuid = api.matter.uuid.generate('example-power-strip')
      this.uuid = uuid

      await api.matter.registerPlatformAccessories('homebridge-example', 'ExamplePowerStripPlatform', [{
        UUID: uuid,
        displayName: 'Example Power Strip',
        deviceType: api.matter.deviceTypes.BridgedNode,
        serialNumber: 'example-power-strip',
        manufacturer: 'Example Co',
        model: 'Strip v1',

        // each part is an endpoint with its own device type, state and handlers
        parts: [
          {
            id: 'outlet-1',
            displayName: 'Outlet 1',
            deviceType: api.matter.deviceTypes.OnOffOutlet,
            clusters: { onOff: { onOff: false } },
            handlers: {
              onOff: {
                on: async () => myStripApi.setSocket(1, true),
                off: async () => myStripApi.setSocket(1, false),
              },
            },
          },
          {
            id: 'outlet-2',
            displayName: 'Outlet 2',
            deviceType: api.matter.deviceTypes.OnOffOutlet,
            clusters: { onOff: { onOff: false } },
            handlers: {
              onOff: {
                on: async () => myStripApi.setSocket(2, true),
                off: async () => myStripApi.setSocket(2, false),
              },
            },
          },
        ],
      }])
    })
  }

  /**
   * Call this when a socket changes outside of Matter. The part id addresses
   * one socket rather than the accessory as a whole.
   */
  async syncSocket(socketNumber, isOn) {
    await this.api.matter.updateAccessoryState(
      this.uuid,
      this.api.matter.clusterNames.OnOff,
      { onOff: isOn },
      `outlet-${socketNumber}`,
    )
  }

  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName)
  }
}
