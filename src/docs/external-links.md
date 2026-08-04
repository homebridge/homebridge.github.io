# External Links

Everything useful that lives outside this site.

## Templates to start from

- [Plugin template](https://github.com/homebridge/homebridge-plugin-template) — a working dynamic platform plugin, TypeScript and lint configured. See [Getting Started](getting-started).
- [Camera plugin template](https://github.com/homebridge/homebridge-plugin-camera-template) — the same, with an FFmpeg streaming delegate. See [Cameras](api/cameras).
- [Homebridge examples](https://github.com/homebridge/homebridge-examples) — examples of the older plugin styles: [accessory](https://github.com/homebridge/homebridge-examples/blob/master/accessory-example-typescript), independent platform and bridged camera. Kept for reference only; new plugins should use the dynamic platform template above.

## Reference documentation

- [HAP-NodeJS API reference](https://developers.homebridge.io/HAP-NodeJS/modules.html) — the generated documentation for every type in the library behind [api.hap](api/hap), including the parts this site does not cover.
- [Matter specification](https://csa-iot.org/all-solutions/matter/) — the Connectivity Standards Alliance's own specification, which the [device types](matter-device-type) and clusters follow.

## Source repositories

- [homebridge](https://github.com/homebridge/homebridge) — the server itself. The API your plugin receives is defined in `src/api.ts`.
- [HAP-NodeJS](https://github.com/homebridge/HAP-NodeJS) — the HomeKit Accessory Protocol implementation.
- [homebridge-matter](https://github.com/homebridge-plugins/homebridge-matter) — the reference plugin for Matter accessories, and the source of most of the [device guides](api/matter-devices).
- [Homebridge UI](https://github.com/homebridge/homebridge-config-ui-x) — the web interface, which renders your [config schema](config-schema) and any [custom user interface](custom-plugin-ui).
- [plugin-ui-utils](https://github.com/homebridge/plugin-ui-utils) — the package behind [custom user interfaces](custom-plugin-ui).

## Wikis and guides

- [Homebridge wiki](https://github.com/homebridge/homebridge/wiki) — installation, configuration and troubleshooting, mostly user-facing.
- [Matter Plugins](https://github.com/homebridge/homebridge/wiki/Matter-Plugins) — how transports and bridges fit together, including the full transport keyword table.
- [homebridge-matter wiki](https://github.com/homebridge-plugins/homebridge-matter/wiki) — complete worked examples for every Matter device type.
- [Verified By Homebridge](https://github.com/homebridge/plugins) — the verification programme and its criteria.

## Community

- [Discord](https://discord.gg/kqNCe2D) — the `#plugin-development` channel is the best place to ask.
- [Reddit](https://www.reddit.com/r/homebridge/)
- [GitHub organisation](https://github.com/homebridge)
