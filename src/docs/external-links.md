# External Links

Everything useful that lives outside this site.

## Templates to start from

- [Plugin template](https://github.com/homebridge/homebridge-plugin-template) — a working dynamic platform plugin, TypeScript and lint configured. See [Getting Started](getting-started).
- [Camera plugin template](https://github.com/homebridge/homebridge-plugin-camera-template) — the same, with an FFmpeg streaming delegate. See [Cameras](api/cameras).
- [Homebridge examples](https://github.com/homebridge/homebridge-examples) — examples of the older plugin styles: [accessory](https://github.com/homebridge/homebridge-examples/blob/master/accessory-example-typescript), independent platform and bridged camera. Kept for reference only; new plugins should use the dynamic platform template above.

## Reference documentation

- [HAP-NodeJS API reference](https://developers.homebridge.io/HAP-NodeJS/modules.html) — the generated documentation for every type in the library behind [api.hap](api/hap), including the parts this site does not cover.
- [Homebridge UI API reference](https://github.com/homebridge/homebridge-config-ui-x/wiki/API-Reference) — the UI's own HTTP API, with Swagger docs you can run locally.
- [Matter specification](https://csa-iot.org/all-solutions/matter/) — the Connectivity Standards Alliance's own specification, which the [device types](matter-device-type) and clusters follow.
- [HomeKit glossary of terms](https://github.com/homebridge/homebridge/wiki/HomeKit-Glossary-of-Terms) — worth a look if the HomeKit vocabulary is new to you.

## Source repositories

- [homebridge](https://github.com/homebridge/homebridge) — the server itself. The API your plugin receives is defined in `src/api.ts`.
- [HAP-NodeJS](https://github.com/homebridge/HAP-NodeJS) — the HomeKit Accessory Protocol implementation.
- [homebridge-matter](https://github.com/homebridge-plugins/homebridge-matter) — the reference plugin for Matter accessories, and the source of most of the [device guides](api/matter-devices).
- [Homebridge UI](https://github.com/homebridge/homebridge-config-ui-x) — the web interface, which renders your [config schema](/#/config-screen/schema) and any [custom user interface](/#/config-screen/custom-ui).
- [plugin-ui-utils](https://github.com/homebridge/plugin-ui-utils) — the package behind [custom user interfaces](/#/config-screen/custom-ui).

## Wikis and guides

- [Homebridge wiki](https://github.com/homebridge/homebridge/wiki) — installation, configuration and troubleshooting, mostly user-facing.
- [Matter Plugins](https://github.com/homebridge/homebridge/wiki/Matter-Plugins) — how transports and bridges fit together, including the full transport keyword table.
- [homebridge-matter wiki](https://github.com/homebridge-plugins/homebridge-matter/wiki) — complete worked examples for every Matter device type.
- [Child Bridges](https://github.com/homebridge/homebridge/wiki/Child-Bridges) — worth understanding, since running a plugin in its own child bridge is the usual advice when it is slow or crash-prone.
- [Bluetooth Plugins](https://github.com/homebridge/homebridge/wiki/Bluetooth-Plugins) — if your plugin talks to BLE devices, it will most likely use a `noble` fork; this page covers which, and the setup users need.
- [FFmpeg for Homebridge](https://github.com/homebridge/ffmpeg-for-homebridge#readme) — prebuilt FFmpeg binaries, useful for [camera plugins](api/cameras).
- [Getting started video](https://www.youtube.com/watch?v=cptIm2naxs4) — a walkthrough of building a plugin.

## Publishing and the plugin programmes

- [Verified By Homebridge](https://github.com/homebridge/plugins) — the verification programme, its criteria and how to apply. See [Publishing](publishing).
- [Scoped Plugins](https://github.com/homebridge/plugins/wiki/Scoped-Plugins) — the `@homebridge-plugins/` npm scope and why plugins move to it.
- [Unmaintained Plugins](https://github.com/homebridge/plugins/wiki/Unmaintained-Plugins) — what happens to a plugin whose maintainer steps away.
- [Donation Links](https://github.com/homebridge/homebridge/wiki/Donation-Links) — the `funding` field that puts a Donate button on your plugin tile.

## Community

- [Discord](https://discord.gg/kqNCe2D) — the `#plugin-development` channel is the best place to ask.
- [Reddit](https://www.reddit.com/r/homebridge/)
- [GitHub organisation](https://github.com/homebridge)
