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
    const storagePath = api.user.storagePath();
  }
}
```

### API.user.configPath
> User.configPath(): string

Returns the path to the Homebridge config.json file.

```js
class ExamplePlatformPlugin {
  constructor(log, config, api) {
    const configPath = api.user.configPath();
  }
}
```


