# API Reference

<div class="callout-block callout-block-warning">
  <div class="content">
    <h4 class="callout-title">
      <span class="callout-icon-holder mr-1">
        <i class="fas fa-info-circle"></i>
      </span>
      Note
    </h4>
    This is a summary of the most commonly used API methods you will need when creating plugins. It is by no means comprehensive.
  </div>
</div>

### API.version

> API.version: number

Returns the current Homebridge API version. Note that this is different from the Homebridge package version.

### API.serverVersion

> API.serverVersion: string

Returns the version of Homebridge itself — the `homebridge` package version, such as `2.0.0`.

### API.versionGreaterOrEqual

> API.versionGreaterOrEqual(version: string): boolean

Returns `true` when the running Homebridge is at least the given version. This is the right way to gate a feature that only exists from a certain Homebridge version — it compares proper semantic versions, where a plain string comparison of `serverVersion` would get pre-release versions wrong.

```js
if (api.versionGreaterOrEqual('2.0.0')) {
  // safe to use features added in homebridge 2.0
}
```

### API.on

> API.on(event: "didFinishLaunching", listener: () => void): API

When this event is fired it means Homebridge has restored all cached accessories from disk. Dynamic Platform plugins should only register new accessories after this event has fired in order to ensure they weren't already added to Homebridge. This event can also be used to start discovery of new accessories.

> API.on(event: "shutdown", listener: () => void): API

This event is fired when homebridge gets shutdown. This could be a regular shutdown or an unexpected crash. At this stage all Accessories are already unpublished and all PlatformAccessories are already saved to disk!

### API.user.storagePath

> User.storagePath(): string

Returns the path to the Homebridge storage folder.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    const storagePath = api.user.storagePath()
  }
}
```

### API.user.configPath

> User.configPath(): string

Returns the path to the Homebridge config.json file.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    const configPath = api.user.configPath()
  }
}
```

### API.hap

> API.hap: HAP

The full [HAP-NodeJS](https://github.com/homebridge/HAP-NodeJS) library — service and characteristic types, UUID generation, categories and more. Always use it through the `api` object rather than importing `hap-nodejs` yourself. See [HAP (Apple Home)](api/hap).

### API.matter

> API.matter: MatterAPI | undefined

The Matter API, present only when Matter is enabled on the bridge the plugin runs on. See [Matter](api/matter).

### API.isMatterAvailable

> API.isMatterAvailable(): boolean

Returns `true` when the running Homebridge version supports Matter at all (Homebridge 2.0 or later). This says nothing about whether the user has turned Matter on — that is [API.isMatterEnabled](api/matter#apiismatterenabled).

### API.registerPlatform

> API.registerPlatform(platformName: string, constructor: PlatformPluginConstructor): void

Register a "Platform" type plugin. Platform style plugins can expose any number of accessories and can dynamically remove and add accessories at any time. Only a single instance of a given platform may be configured in the Homebridge `config.json`.

```js
module.exports = (api) => {
  api.registerPlatform('ExamplePlatformName', ExamplePlatformPlugin)
}

class ExamplePlatformPlugin {
  constructor(log, config, api) {
    log.debug('Example Platform Plugin Loaded')
  }
}
```

This is how every platform plugin is registered, whether it exposes accessories over HAP, over Matter, or both. See [Platform Plugins](api/platform-plugins) for the platform lifecycle.

### API.registerAccessory

> API.registerAccessory(accessoryName: string, constructor: AccessoryPluginConstructor): void

Register an "Accessory" type plugin — the older, HAP-only plugin style. See [Accessory Plugins](api/accessory-plugins).
