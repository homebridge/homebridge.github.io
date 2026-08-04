# Homebridge Plugin Development

[Homebridge](https://github.com/homebridge/homebridge) is a lightweight Node.js server you can run on your home network that emulates the iOS HomeKit API, and — from Homebridge 2.0 — can expose accessories over [Matter](/#/api/matter) as well. It supports Plugins, which are community-contributed modules that provide a basic bridge from HomeKit or Matter to various 3rd-party APIs provided by manufacturers of "smart home" devices.

This site contains resources to help Homebridge plugin developers.

## Where to start

- **[Getting Started](/#/getting-started)** — the plugin templates, how a plugin is laid out, and the discovery pattern nearly every plugin uses
- **[HAP vs Matter](/#/hap-vs-matter)** — how the two protocols compare, and which your plugin should support
- **[API Reference](/#/api/reference)** — the API object your plugin is handed, and the platform lifecycle
- **[External Links](/#/external-links)** — templates, wikis, source repositories and the community

---

## Declaring Supported Transports

Your plugin should say which transports it publishes accessories over, using `package.json` keywords alongside the `homebridge-plugin` keyword you already have:

- `supports-hap` — the plugin publishes accessories over HAP (HomeKit)
- `supports-matter` — the plugin registers Matter accessories itself

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

## Verified By Homebridge

When developing a Homebridge plugin, it can be considered best practice to follow the criteria of the Verified By Homebridge Program, whether you intend to submit your plugin for verification or not. This ensures that your plugin is compatible with the widest range of Homebridge setups and provides the best possible user experience.

For more information about verification and the criteria, see the [Verified By Homebridge Program](https://github.com/homebridge/plugins).
