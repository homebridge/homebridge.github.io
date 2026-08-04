# Matter

Homebridge 2.0 can expose your plugin's accessories over [Matter](https://csa-iot.org/all-solutions/matter/) as well as HAP. A plugin does not have to choose between them — the same [platform plugin](api/platform-plugins) can register HAP accessories, Matter accessories, or both, and the user decides which bridges are enabled.

Matter accessories in Homebridge are **virtual devices**. Your plugin sits between the real device and the Matter controller:

- **The physical device** — whatever your plugin already talks to, over a cloud API, HTTP, MQTT or a local protocol
- **The virtual Matter device** — the representation a Matter controller sees and sends commands to
- **Your plugin** — translating commands one way and state changes the other

This section covers everything Matter-specific:

- [Platform Methods](api/matter-platform-methods) — registering and managing Matter accessories
- [State](api/matter-state) — keeping the values a controller sees in sync with the real device
- [Errors](api/matter-errors) — reporting failures with the right Matter status code
- [Device Guides](api/matter-devices) — per-family handler names, value scales and quirks
- [Device Types](matter-device-type) — every device type Homebridge supports, with its clusters
- [Clusters](api/matter-clusters) — every cluster, and which device types use it

### Coming from HAP

The concepts line up closely, so most of what you know transfers:

- A HAP **Accessory** is a Matter **Endpoint** — the device itself, one tile in the Home app
- A HAP **Service** is a Matter **Cluster** — a capability, such as on/off or brightness
- A HAP **Characteristic** is a Matter **Attribute** — a single value, such as `onOff` or `currentLevel`

Three differences are worth knowing before you start:

- Matter accessories are **declared up front**. You describe the whole accessory — its device type, its clusters and its handlers — in one object, rather than building it up by adding services and characteristics.
- The registration methods are **asynchronous**. `registerPlatformAccessories()` and its siblings return promises, where the HAP equivalents are synchronous.
- State is read and written through **methods**, not properties: `updateAccessoryState()` and `getAccessoryState()`, both async. HAP's `characteristic.value` has no direct equivalent.

## Checking Matter is available

### API.isMatterEnabled

> API.isMatterEnabled(): boolean

Returns `true` when Matter is enabled for the bridge your plugin is running on. Users turn it on per bridge — `bridge.matter` in `config.json` for the main bridge, or `_bridge.matter` in the platform config for a child bridge — so it may be off even on a Homebridge 2.0 install.

Because of that, `api.matter` is typed as `MatterAPI | undefined`. It is only present when Matter is actually enabled, and the type is honest about it. There are two sensible ways to deal with that.

**Optional chaining**, when your plugin should keep working either way:

```js
api.matter?.registerPlatformAccessories('homebridge-example', 'ExamplePlatform', accessories)
```

Every call becomes a no-op when Matter is off, so a plugin that also supports HAP keeps running normally.

**Guarding once**, when your plugin is Matter-only or has a distinct Matter path:

```js
async function configureMatter() {
  if (!api.isMatterEnabled()) {
    log.info('Matter is not enabled on this bridge')
    return
  }

  // past this point api.matter is guaranteed to be present
  await api.matter.registerPlatformAccessories('homebridge-example', 'ExamplePlatform', accessories)
}
```

## Telling users your plugin supports Matter

Add the relevant keywords to your plugin's `package.json` so the Homebridge UI can show which transports it supports, and offer the right bridge options when a user sets it up:

```json
{
  "keywords": [
    "homebridge-plugin",
    "supports-hap",
    "supports-matter"
  ]
}
```

A plugin with neither keyword is treated as HAP-only, so existing plugins need no change.
