# Homebridge Plugin Development

[Homebridge](https://github.com/homebridge/homebridge) is a lightweight Node.js server you can run on your home network that emulates the iOS HomeKit API. It supports Plugins, which are community-contributed modules that provide a basic bridge from HomeKit to various 3rd-party APIs provided by manufacturers of "smart home" devices.

This site contains resources to help Homebridge plugin developers.

## Homebridge Plugin Templates

We have created templates which you can use as a base to help you get started developing your own plugin.

These plugin templates offer the following features:

* A base [dynamic](/#/api/platform-plugins) plugin that can easily be expanded
* [TypeScript](https://www.typescriptlang.org/) with ESLint rules and Homebridge typings pre-configured
* Automatic code compiling and Homebridge restart on code change with `npm run watch`

### Dynamic Template

- [homebridge-plugin-template](https://github.com/homebridge/homebridge-plugin-template)

### Camera Plugin Template

- [homebridge-plugin-camera-template](https://github.com/homebridge/homebridge-plugin-camera-template)

#### Verified By Homebridge Program

When developing a Homebridge plugin, it can be considered best practice to follow the criteria of the Verified By Homebridge Program, whether you intend to submit your plugin for verification or not. This ensures that your plugin is compatible with the widest range of Homebridge setups and provides the best possible user experience.

For more information about verification and the criteria, see the [Verified By Homebridge Program](https://github.com/homebridge/plugins).

---

## Declaring Supported Transports

Your plugin should say which transports it publishes accessories over, using `package.json` keywords alongside the `homebridge-plugin` keyword you already have:

* `supports-hap` — the plugin publishes accessories over HAP (HomeKit)
* `supports-matter` — the plugin registers Matter accessories itself

```json
{
  "keywords": [
    "homebridge-plugin",
    "supports-hap"
  ]
}
```

Most plugins are HAP-only and want `supports-hap` on its own. Declare both if your plugin does both.

**If you declare one transport keyword, declare every transport you support** — the Homebridge UI treats a declaration as complete. In particular, `supports-matter` on its own means Matter-only, and the UI will set new child bridges up with HAP disabled. Declaring no keywords at all is still fine and keeps the existing behaviour.

The plugin templates already include `supports-hap`, so new plugins get this for free.

For the full table of what each combination does, see [Matter Plugins](https://github.com/homebridge/homebridge/wiki/Matter-Plugins#declaring-supported-transports) in the Homebridge wiki.

---

## Deprecated Templates

⚠️ The following templates are kept here for reference but are no longer maintained. For any existing plugin of one of the following types, it is recommended to update your plugin to the dynamic platform type.

* [Accessory Plugin](https://github.com/homebridge/homebridge-examples/blob/master/accessory-example-typescript)
* [Independent Platform Plugin](https://github.com/homebridge/homebridge-examples/blob/master/independent-platform-example-typescript)
* [Bridged Camera Platform](https://github.com/homebridge/homebridge-examples/blob/master/bridged-camera-example-typescript)
