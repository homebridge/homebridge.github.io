# Homebridge Plugin Development

[Homebridge](https://github.com/homebridge/homebridge) is a lightweight NodeJS server you can run on your home network that emulates the iOS HomeKit API. It supports Plugins, which are community-contributed modules that provide a basic bridge from HomeKit to various 3rd-party APIs provided by manufacturers of "smart home" devices.

This site contains resources to help Homebridge plugin developers.

### Homebridge Plugin Templates

We have created templates which you can use as a base to help you get started developing your own plugin.

These plugin templates offer the following features:

* A base [dynamic platform](/#/api/platform-plugins) plugin that can easily be expanded
* [TypeScript](https://www.typescriptlang.org/) with ESLint rules and Homebridge typings pre-configured
* Automatic code compiling and Homebridge restart on code change with `npm run watch`

#### Dynamic Platform Template

- [homebridge-plugin-template](https://github.com/homebridge/homebridge-plugin-template)

#### Camera Plugin Template

- [homebridge-plugin-camera-template](https://github.com/homebridge/homebridge-plugin-camera-template)

---

### Deprecated Templates

The following templates are kept here for reference, but are no longer maintained. When creating a new plugin, it is recommended to use the above `homebridge-plugin-template` instead.

For existing plugins, it is recommended to update your plugin to the dynamic platform type.

#### [DEPRECATED] Accessory Plugins

[Accessory plugins](/#/api/accessory-plugins) are the most basic and simplest plugins for homebridge. They should be used if you only want to 
expose a single accessory and don't require any special functionality.

* [Accessory Plugin](https://github.com/homebridge/homebridge-examples/blob/master/accessory-example-typescript): A simple Switch accessory.

#### [DEPRECATED] Platform Plugins

[Platform plugins](/#/api/platform-plugins) are able to expose multiple accessories. Additionally, they are required if you want to use the 
Controller API. 

* [Dynamic Platform Plugin](https://github.com/homebridge/homebridge-examples/blob/master/dynamic-platform-example-typescript)
  * Dynamic platforms can dynamically add or remove 
accessories at runtime. Accessories are fully stored to disk by homebridge, and the exact state is reconstructed on
a reboot. The plugin can store additional context as well. 
* [Independent Platform Plugin](https://github.com/homebridge/homebridge-examples/blob/master/independent-platform-example-typescript)
  * Independent platforms are typically used
when the platform intends to only expose external accessories or provides other functionality while not exposing
an accessory at all.
* [Bridged Camera Platform](https://github.com/homebridge/homebridge-examples/blob/master/bridged-camera-example-typescript)
