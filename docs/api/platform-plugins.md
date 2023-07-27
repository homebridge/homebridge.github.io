# Platform Plugins

### API.registerPlatform
> API.registerPlatform(platformName: string, constructor: PlatformPluginConstructor): void

Register a "Platform" type plugin. Platform style plugins can expose any number of accessories and can dynamically remove and add accessories at any time. Only a single instance of a given platform may be configured in the Homebridge `config.json`.

```js
module.exports = (api) => {
  api.registerPlatform('ExamplePlatformName', ExamplePlatformPlugin);
}

class ExamplePlatformPlugin {
  constructor(log, config, api) {
    log.debug('Example Platform Plugin Loaded');
  }
}
```

### API.registerPlatformAccessories
> API.registerPlatformAccessories(pluginIdentifier: string, platformName: string, accessories: PlatformAccessory[]): void

Publish one or more accessories to Homebridge.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {

    // store restored cached accessories here
    this.accessories = [];

    /**
     * Platforms should wait until the "didFinishLaunching" event has fired before
     * registering any new accessories.
     */
    api.on('didFinishLaunching', () => {
      const uuid = api.hap.uuid.generate('SOMETHING UNIQUE');

      // check the accessory was not restored from cache
      if (!this.accessories.find(accessory => accessory.UUID === uuid)) {

        // create a new accessory
        const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid);

        // register the accessory
        api.registerPlatformAccessories('PLUGIN_NAME', 'PLATFORM_NAME', [accessory]);
      }
    });
  }

  /**
   * REQUIRED - Homebridge will call the "configureAccessory" method once for every cached
   * accessory restored
   */
  configureAccessory(accessory) {
    this.accessories.push(accessory);
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
    this.accessories = [];

    /**
     * Platforms should wait until the "didFinishLaunching" event has fired before
     * unregistering any accessories.
     */
    api.on('didFinishLaunching', () => {
      // for the example just remove the first restored cached accessory
      const accessory = this.accessories[0];

      api.unregisterPlatformAccessories('PLUGIN_NAME', 'PLATFORM_NAME', [accessory]);
    });
  }

  /**
   * Homebridge will call the "configureAccessory" method once for every cached
   * accessory restored
   */
  configureAccessory(accessory) {
    this.accessories.push(accessory);
  }
}
```

### API.publishExternalAccessories
> API.publishExternalAccessories(pluginIdentifier: string, accessories: PlatformAccessory[]): void

Accessories published externally will need to be paired separately by the user. Common uses for external accessories include Cameras and TVs.

### API.updatePlatformAccessories
> API.updatePlatformAccessories(accessories: PlatformAccessory[]): void

## Platform Accessory

### API.platformAccessory
> API.platformAccessory(displayName: string, uuid: string, category?: any): PlatformAccessory

Creates a new platform accessory. It will not be active until you register the created accessory with `API.registerPlatformAccessories` method.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.api = api;

    const uuid = this.api.hap.uuid.generate('SOMETHING UNIQUE');
    const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid);
  }
}
```

### PlatformAccessory.addService
> PlatformAccessory.addService(service: Service, ...constructorArgs: any[]): Service

Adds a new service to a platform accessory.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.api = api;

    const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid);

    // get the LightBulb service if it exists
    let service = accessory.getService(this.api.hap.Service.Lightbulb);

    // otherwise create a new LightBulb service
    if (!service) {
      service = accessory.addService(this.api.Service.Lightbulb);
    }
  }
}
```

If you are adding more than one service of the same type to an accessory, you will need to give the service a name and "subtype".

```js
const service2 = accessory.addService(Service.Lightbulb, 'Light Bulb 1', 'USER_DEFINED_SUBTYPE');
```

### PlatformAccessory.getService
> PlatformAccessory.getService(name: string | T): any

Returns an existing service from the platform accessory.

```js
const service = accessory.getService(this.api.hap.Service.Lightbulb);
```

If you have added more than one service of the same type to an accessory, you will need to get the service using the name you defined when adding it.

```js
const service2 = accessory.getService('Light Bulb 1');
```

### PlatformAccessory.removeService
> PlatformAccessory.removeService(service: Service): void

Removes the service from the platform accessory.

### PlatformAccessory.context
> PlatformAccessory.context

Store custom data with accessory that will persist through Homebridge restarts.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.api = api;

    const uuid = this.api.hap.uuid.generate('SOMETHING UNIQUE');
    const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid);

    // data stored on the context object will persist through restarts
    accessory.context.myData = 'anything';
  }
}
```

### PlatformAccessory.services
> PlatformAccessory.services: Service[]

An array of services currently added to the accessory.
