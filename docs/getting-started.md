# Getting Started

The quickest way to start a plugin is the [plugin template](https://github.com/homebridge/homebridge-plugin-template) — a working dynamic platform plugin with TypeScript, ESLint and the Homebridge types already configured. Use it as a GitHub template, rename a few things, and you have a plugin that runs.

For a camera plugin, start from the [camera plugin template](https://github.com/homebridge/homebridge-plugin-camera-template) instead, and read [Cameras](api/cameras).

## What Homebridge expects of a plugin

A plugin is an npm package with three things:

- **The `homebridge-plugin` keyword** in `package.json`. Homebridge and the Homebridge UI find plugins by this keyword, so without it your plugin is invisible.
- **An `engines` block** naming the Homebridge and Node versions you support, for example `"homebridge": "^1.8.0 || ^2.0.0"`.
- **A `main` entry point** that exports a function taking the [API](api/reference) object.

Add [transport keywords](api/matter#telling-users-your-plugin-supports-matter) alongside `homebridge-plugin` so the UI knows which bridges to offer — the template already includes `supports-hap`.

## How the template is laid out

Four files, each with one job:

- **`settings.ts`** holds `PLATFORM_NAME` (what users put in their `config.json`) and `PLUGIN_NAME` (which must match the package name in `package.json`). Both are used when registering and unregistering accessories, which is why they live in one place.
- **`index.ts`** is the entry point, and does one thing — registers the platform:

  ```js
  export default (api) => {
    api.registerPlatform(PLATFORM_NAME, ExampleHomebridgePlatform)
  }
  ```

- **`platform.ts`** is the platform class: it receives the config, restores cached accessories in `configureAccessory`, and discovers devices once `didFinishLaunching` fires. See [Platform Plugins](api/platform-plugins) for the lifecycle.
- **`platformAccessory.ts`** is one accessory: it adds the services and wires up the characteristic handlers. See [Service](api/service) and [Characteristics](api/characteristics).

## The discovery pattern

The heart of the template is the loop in `discoverDevices()`, and it is the pattern nearly every platform plugin uses:

1. Ask the device API what exists.
2. For each device, build a stable UUID from something that never changes — a serial number or device id — with `api.hap.uuid.generate()`.
3. If an accessory with that UUID was restored from the cache, reuse it.
4. If not, create one and register it with [registerPlatformAccessories](api/hap-platform-methods#apiregisterplatformaccessories).
5. Unregister anything in the cache that the API no longer reports, so devices removed upstream disappear from HomeKit.

Getting the UUID input right is the part worth care. It must be stable across restarts and unique per device: if it changes, HomeKit sees a brand-new accessory and the user loses their room assignment, name and automations.

## Developing against a running Homebridge

The template's watch script rebuilds and restarts Homebridge whenever you change a file:

```bash
npm run watch
```

It builds, links the package so a local Homebridge instance picks it up, and runs `nodemon`. The template ships a test Homebridge config under `test/` for it to use.

Run Homebridge with `-D` while developing so your [debug logging](api/log#debug) appears.

## Publishing

Publish to npm as normal — see [Publishing Your Plugin](publishing) for what to check before the first release, how verification works, and how to add donation links.
