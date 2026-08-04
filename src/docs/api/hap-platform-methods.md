# Platform Methods (HAP)

These are the methods a platform plugin uses to publish and manage accessories over HAP. Registering the platform itself is protocol-neutral and covered under [Common](api/reference#apiregisterplatform); for the Matter equivalents of the methods below, see [Platform Methods (Matter)](api/matter-platform-methods).

### API.registerPlatformAccessories

> API.registerPlatformAccessories(pluginIdentifier: string, platformName: string, accessories: PlatformAccessory[]): void

Publish one or more accessories to Homebridge.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    // store restored cached accessories here
    this.accessories = []

    /**
     * Platforms should wait until the "didFinishLaunching" event has fired before
     * registering any new accessories.
     */
    api.on('didFinishLaunching', () => {
      const uuid = api.hap.uuid.generate('SOMETHING UNIQUE')

      // check the accessory was not restored from cache
      if (!this.accessories.some(accessory => accessory.UUID === uuid)) {
        // create a new accessory
        const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid)

        // register the accessory
        api.registerPlatformAccessories('PLUGIN_NAME', 'PLATFORM_NAME', [accessory])
      }
    })
  }

  /**
   * REQUIRED - Homebridge will call the "configureAccessory" method once for every cached
   * accessory restored
   */
  configureAccessory(accessory) {
    this.accessories.push(accessory)
  }
}
```

### API.unregisterPlatformAccessories

> API.unregisterPlatformAccessories(pluginIdentifier: string, platformName: string, accessories: PlatformAccessory[]): void

Remove one or more accessories from Homebridge.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    // store restored cached accessories here
    this.accessories = []

    /**
     * Platforms should wait until the "didFinishLaunching" event has fired before
     * unregistering any accessories.
     */
    api.on('didFinishLaunching', () => {
      // for the example just remove the first restored cached accessory
      const accessory = this.accessories[0]

      api.unregisterPlatformAccessories('PLUGIN_NAME', 'PLATFORM_NAME', [accessory])
    })
  }

  /**
   * Homebridge will call the "configureAccessory" method once for every cached
   * accessory restored
   */
  configureAccessory(accessory) {
    this.accessories.push(accessory)
  }
}
```

### API.updatePlatformAccessories

> API.updatePlatformAccessories(accessories: PlatformAccessory[]): void

Saves changes made to already-registered accessories back to the cache — a new display name, or anything you have put on `accessory.context`. Without this, the changes are lost when Homebridge restarts.

```js
accessory.context.firmware = device.firmwareVersion
api.updatePlatformAccessories([accessory])
```

### API.publishExternalAccessories

> API.publishExternalAccessories(pluginIdentifier: string, accessories: PlatformAccessory[]): void

Publishes an accessory as a standalone HAP accessory rather than through the Homebridge bridge. Common uses are cameras and TVs — HomeKit only allows one television per bridge, so a plugin exposing several must publish them externally.

An external accessory behaves differently in three ways that all reach the user:

- **It is paired separately.** Adding the Homebridge bridge to a home does not add it. Each one gets its own port, and the Homebridge log prints its name and setup code at startup, telling the user to add it manually in the Home app. The setup code is the same as the bridge's.
- **It is not cached.** `configureAccessory` is never called for external accessories, so there is nothing to restore and nothing to check against — publish them again on every startup.
- **Its category matters.** The category passed to [API.platformAccessory](api/hap-platform-methods#apiplatformaccessory) sets the icon shown while pairing, so give an external accessory the right one.

The first argument must be your **plugin identifier** — the npm package name, such as `homebridge-example` — not the platform name. Passing the platform name is a common mistake, and Homebridge logs a complaint asking the user to report it to you.

```js
api.publishExternalAccessories('homebridge-example', [accessory])
```

Do not also register an external accessory with `registerPlatformAccessories()`; it is published one way or the other.

This is the HAP counterpart to Matter's [accessories that get their own bridge](api/matter-platform-methods#accessories-that-get-their-own-bridge), except that Matter decides for you which device types need it.

## Platform Accessory

### API.platformAccessory

> API.platformAccessory(displayName: string, uuid: string, category?: any): PlatformAccessory

Creates a new platform accessory. It will not be active until you register the created accessory with `API.registerPlatformAccessories` method.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.api = api

    const uuid = this.api.hap.uuid.generate('SOMETHING UNIQUE')
    const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid)
  }
}
```

### PlatformAccessory.addService

> PlatformAccessory.addService(service: Service, ...constructorArgs: any[]): Service

Adds a new service to a platform accessory.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.api = api

    const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid)

    // get the LightBulb service if it exists
    let service = accessory.getService(this.api.hap.Service.Lightbulb)

    // otherwise create a new LightBulb service
    if (!service) {
      service = accessory.addService(this.api.Service.Lightbulb)
    }
  }
}
```

If you are adding more than one service of the same type to an accessory, you will need to give the service a name and "subtype".

```js
const service2 = accessory.addService(Service.Lightbulb, 'Light Bulb 1', 'USER_DEFINED_SUBTYPE')
```

### PlatformAccessory.getService

> PlatformAccessory.getService(name: string | T): any

Returns an existing service from the platform accessory.

```js
const service = accessory.getService(this.api.hap.Service.Lightbulb)
```

If you have added more than one service of the same type to an accessory, you will need to get the service using the name you defined when adding it.

```js
const service2 = accessory.getService('Light Bulb 1')
```

### PlatformAccessory.getServiceById

> PlatformAccessory.getServiceById(uuid: string | T, subType: string): Service | undefined

Returns an existing service by its type and the "subtype" it was added with — the reliable way to find one of several services of the same type, since the subtype cannot be changed by the user renaming the service.

```js
const service2 = accessory.getServiceById(this.api.hap.Service.Lightbulb, 'USER_DEFINED_SUBTYPE')
```

### PlatformAccessory.updateDisplayName

> PlatformAccessory.updateDisplayName(name: string): void

Change the accessory's display name after it has been created, for example when the device is renamed in the manufacturer's own app.

### PlatformAccessory.removeService

> PlatformAccessory.removeService(service: Service): void

Removes the service from the platform accessory.

### PlatformAccessory.context

> PlatformAccessory.context

Store custom data with accessory that will persist through Homebridge restarts.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.api = api

    const uuid = this.api.hap.uuid.generate('SOMETHING UNIQUE')
    const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid)

    // data stored on the context object will persist through restarts
    accessory.context.myData = 'anything'
  }
}
```

### PlatformAccessory.services

> PlatformAccessory.services: Service[]

An array of services currently added to the accessory.
