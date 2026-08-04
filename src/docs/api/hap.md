# HAP (Apple Home)

HAP is the HomeKit Accessory Protocol — the protocol Apple Home uses to talk to accessories. It is Homebridge's original transport: accessories your plugin publishes over HAP appear through the Homebridge bridge in the Apple Home app.

An accessory published over HAP is built from three layers:

- An **Accessory** is the device itself — one tile in the Home app
- A **Service** is a capability of the device, such as on/off or brightness
- A **Characteristic** is a single value inside a service, such as `On` or `Brightness`

Your plugin builds an accessory by adding services to it, then wiring up the characteristics of each service — reacting when HomeKit changes a value, and pushing updates when the real device changes.

This section covers everything HAP-specific:

- [Platform Methods](api/hap-platform-methods) — publishing and managing accessories from a [platform plugin](api/platform-plugins)
- [Accessory Plugins](api/accessory-plugins) — the older, HAP-only plugin style
- [Service](api/service) and [Characteristics](api/characteristics) — working with the values HomeKit sees
- [Service Types](service) — every service Homebridge supports, with its characteristics
- [Categories](categories) — the icon a HAP accessory gets in the Home app

## The `api.hap` object

`api.hap` is the full [HAP-NodeJS](https://github.com/homebridge/HAP-NodeJS) library, the implementation of HAP that Homebridge is built on. Always use it through the `api` object rather than importing `hap-nodejs` yourself — an import would load a second copy of the library, and its accessories would not work correctly with the running Homebridge.

The most used parts are:

### API.hap.Service

The constructors for every service type, used when adding a service to an accessory:

```js
const service = accessory.addService(this.api.hap.Service.Lightbulb)
```

See [Service Types](service) for the full list.

### API.hap.Characteristic

The characteristic types, used when getting a characteristic from a service:

```js
service.getCharacteristic(this.api.hap.Characteristic.Brightness)
```

### API.hap.uuid

Generates the stable identifier every accessory needs. Given the same input, it always produces the same UUID — so use something unique to the device that never changes, such as its serial number:

```js
const uuid = this.api.hap.uuid.generate(device.serialNumber)
```

### API.hap.Categories

The category tells the Home app which icon to show while pairing. See [Categories](categories) for the full list.

```js
const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid, this.api.hap.Categories.FAN)
```

### API.hap.HapStatusError

Throwing this from an `onGet` or `onSet` handler reports a specific HAP status code back to HomeKit, rather than a generic failure — the HAP counterpart to [Matter's status errors](api/matter#handling-errors):

```js
service.getCharacteristic(this.api.hap.Characteristic.On)
  .onGet(async () => {
    if (!device.reachable) {
      throw new this.api.hap.HapStatusError(this.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE)
    }
    return device.isOn
  })
```

`SERVICE_COMMUNICATION_FAILURE` is the one to reach for when the device cannot be contacted — it is what marks an accessory as "No Response" in the Home app. Other codes include `RESOURCE_BUSY`, `OPERATION_TIMED_OUT` and `NOT_ALLOWED_IN_CURRENT_STATE`.

### Everything else

`api.hap` contains far more than the helpers above — camera and TV controllers, the data stream API, colour utilities and the underlying accessory classes. The full API is documented in the [HAP-NodeJS reference](https://developers.homebridge.io/HAP-NodeJS/modules.html).
