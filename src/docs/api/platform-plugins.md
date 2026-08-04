# Platform Plugins

A platform plugin is registered with Homebridge once, and can expose any number of accessories. It can add and remove accessories at any time while Homebridge is running. This is the recommended plugin type for all new plugins — the [plugin template](https://github.com/homebridge/homebridge-plugin-template) is a platform plugin.

The platform itself is protocol-neutral. The same platform can publish its accessories over HAP, over [Matter](api/matter), or both at the same time — the concepts on this page apply either way. Only the methods used to publish and manage the accessories differ:

- [Platform Methods (HAP)](api/hap-platform-methods) — publishing accessories over HAP
- [Matter](api/matter) — publishing accessories over Matter

## Registering a platform

A plugin's entry file exports a function that Homebridge calls when it loads the plugin. This is where the platform class is registered, using [API.registerPlatform](api/reference#apiregisterplatform):

```js
module.exports = (api) => {
  api.registerPlatform('ExamplePlatformName', ExamplePlatformPlugin)
}
```

Only a single instance of a given platform may be configured in the Homebridge `config.json`.

## The constructor

Homebridge creates an instance of the platform class for the configured platform, passing three arguments:

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api
  }
}
```

- `log` — the plugin's logger, see [Log](api/log)
- `config` — the plugin's config block from the Homebridge `config.json`
- `api` — the Homebridge API object, see [Common](api/reference)

## The startup lifecycle

Homebridge restores accessories it already knows about from its cache on disk, before your platform gets a chance to talk to any external system. The lifecycle runs in this order:

1. **The constructor** runs when Homebridge loads the plugin.
2. **`configureAccessory(accessory)`** is called once for every cached HAP accessory belonging to your platform. Store what you are given — this is how you avoid registering duplicates later. See [Platform Methods (HAP)](api/hap-platform-methods#apiregisterplatformaccessories).
3. **`configureMatterAccessory(accessory)`** is called once for every cached Matter accessory, if your platform publishes any. This is the Matter equivalent of `configureAccessory`. See [Matter](api/matter#platformconfigurematteraccessory).
4. **The `didFinishLaunching` event** fires once every cached accessory has been restored. Only register new accessories after this event, so you can tell what was already restored from the cache. This is also the right place to start discovering devices.
5. **The `shutdown` event** fires when Homebridge is shutting down, whether cleanly or after a crash. Cached accessories have already been saved to disk by this point.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.log = log
    this.config = config
    this.api = api

    // cached accessories are collected here as homebridge restores them
    this.accessories = []

    api.on('didFinishLaunching', () => {
      // safe to discover devices and register new accessories from here
    })

    api.on('shutdown', () => {
      // stop timers and close connections here
    })
  }

  configureAccessory(accessory) {
    this.accessories.push(accessory)
  }
}
```

## Other platform types

Two older platform styles still exist, but the deprecated templates for them are kept only for reference:

- **Static platforms** expose a fixed set of accessories at startup, which cannot change while Homebridge is running.
- **Independent platforms** add no accessories to the main bridge at all — used by plugins that only publish [external accessories](api/hap-platform-methods#apipublishexternalaccessories), or that expose no accessories.

For any existing plugin of one of these types, it is recommended to update the plugin to the dynamic platform type described on this page.
