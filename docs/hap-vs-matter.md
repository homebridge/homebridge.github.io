# HAP vs Matter

Homebridge can expose your plugin's accessories over two protocols:

- **HAP** — the HomeKit Accessory Protocol, Homebridge's original transport. Accessories appear in the Apple Home app through the Homebridge bridge.
- **Matter** — available from Homebridge 2.0. A Matter bridge can be paired with Apple Home too, and also with other Matter controllers.

A plugin does not have to choose. The same [platform plugin](api/platform-plugins) can publish its accessories over HAP, over Matter, or both at the same time — the user decides which bridges are enabled. Everything protocol-neutral (registering the platform, the startup lifecycle, logging, config) is shared; only the publishing methods differ.

## The concepts, side by side

The two protocols model a device the same way, under different names:

| Concept                       | HAP             | Matter      |
| ----------------------------- | --------------- | ----------- |
| The device — one tile in Home | Accessory       | Endpoint    |
| A capability, such as on/off  | Service         | Cluster     |
| A single value                | Characteristic  | Attribute   |
| What kind of device it is     | Category (icon) | Device Type |

## The programming model, side by side

The APIs differ more than the concepts do:

| Task                         | HAP                                                             | Matter                                                                      |
| ---------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Building an accessory        | Built up step by step — add services, then wire characteristics | Declared up front — one object with device type, clusters and handlers      |
| Registering accessories      | [Synchronous methods](api/hap-platform-methods)                 | [Async methods](api/matter-platform-methods) that return promises           |
| Reacting to commands         | `onSet` handlers per characteristic                             | `handlers` per cluster command                                              |
| Pushing device changes       | `service.updateCharacteristic()`                                | [`updateAccessoryState()`](api/matter-state#apimatterupdateaccessorystate)  |
| Reading current state        | `characteristic.value`                                          | [`getAccessoryState()`](api/matter-state#apimattergetaccessorystate), async |
| Restoring cached accessories | `configureAccessory()`                                          | `configureMatterAccessory()`                                                |
| Reporting a specific failure | [`HapStatusError`](api/hap#apihaphapstatuserror)                | [`api.matter.status` classes](api/matter-errors)                            |
| Persisting your own data     | `accessory.context`                                             | `accessory.context`                                                         |

## The same light, both ways

Reacting to "turn the light on" from the Home app.

Over HAP, you get the service's characteristic and attach a handler:

```js
const service = accessory.getService(api.hap.Service.Lightbulb)
  || accessory.addService(api.hap.Service.Lightbulb)

service.getCharacteristic(api.hap.Characteristic.On)
  .onSet(async (value) => {
    await myLightApi.setPower(value)
  })
```

Over Matter, the handler is part of the accessory you register:

```js
await api.matter.registerPlatformAccessories('homebridge-example', 'ExamplePlatform', [{
  UUID: uuid,
  displayName: 'Living Room Light',
  deviceType: api.matter.deviceTypes.OnOffLight,
  clusters: {
    onOff: { onOff: false },
  },
  handlers: {
    onOff: {
      on: async () => {
        await myLightApi.setPower(true)
      },
      off: async () => {
        await myLightApi.setPower(false)
      },
    },
  },
}])
```

## Which should a plugin support?

- **HAP** reaches every Homebridge user today, on every Homebridge version. If you support one protocol, support HAP.
- **Matter** requires Homebridge 2.0 with Matter enabled on the bridge. Adding it lets users pair the bridge with non-Apple Matter controllers as well, and it is straightforward to add alongside existing HAP support — see [Checking Matter is available](api/matter#checking-matter-is-available).

Whichever you support, declare it with the `package.json` keywords described in [Telling users your plugin supports Matter](api/matter#telling-users-your-plugin-supports-matter), so the Homebridge UI can set bridges up correctly.
