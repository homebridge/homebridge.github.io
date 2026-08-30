# Custom Services & Characteristics

Every service and characteristic is identified by a UUID. Apple defines the standard set — `Switch`, `On`, `CurrentTemperature` and the rest, listed under [Service Types](service) — but HAP itself does not care whether a UUID is one of Apple's. A plugin can publish services and characteristics with UUIDs of its own invention, and controllers that recognise them will show them.

That last part is the honest limitation, so it comes first:

> The Apple Home app **ignores** custom services and characteristics entirely. It renders the types it knows and skips the rest — a custom characteristic added to a standard service is simply invisible there, and an accessory made up _only_ of custom services shows as "Not Supported".

So custom types are not a way to add new tiles to the Home app. They are for everything else:

- **Third-party HomeKit apps** — [Eve](https://apps.apple.com/app/eve-for-matter-homekit/id917695792), [Controller for HomeKit](https://controllerforhomekit.com/), Home+ and others display custom characteristics with their name, value and unit, and let the user change writable ones. A power outlet exposing voltage, current and consumption readings is perfectly usable from Eve while the Home app just shows the switch.
- **Extra data on a real accessory** — sensor readings, diagnostics, or counters that have no standard characteristic.
- **Per-accessory settings** — a writable custom characteristic works as a configuration toggle that lives on the accessory itself rather than in the plugin config.
- **Eve history** — the Eve app's measurement graphs are driven by a community-decoded custom service; see [the Eve conventions](#the-eve-conventions) below.

Custom types are a HAP concept. On the Matter side the cluster set is fixed by the specification — there is no plugin-defined equivalent, which is one of the trade-offs listed in [HAP vs Matter](hap-vs-matter).

## UUIDs are forever

A custom type's UUID is its identity — to HAP, to controllers, and to whatever a user has built on top of it. Two rules:

1. **Use a full random UUID, in your own namespace.** Generate one (`uuidgen`, or any UUID tool) and use variations of it for your related types. Do not invent short-form UUIDs — the short form (`0000004A-0000-1000-8000-0026BB765291`) is Apple's reserved range.
2. **Never change it once shipped.** A changed UUID is a _different_ characteristic: controllers forget the old one, and anything the user configured against it breaks. Treat published UUIDs like a public API.

A common pattern is one base UUID with a counter in the first segment, so related types read as a family:

```
E964F004-079E-48FF-8F27-9C2605A29F52
E964F005-079E-48FF-8F27-9C2605A29F52
E964F006-079E-48FF-8F27-9C2605A29F52
```

## Creating your own from scratch

Everything needed ships with Homebridge — subclass `api.hap.Characteristic` and `api.hap.Service`. Because the classes hang off the `API` object handed to your plugin at runtime, the TypeScript pattern is a factory function that receives it:

```ts
import type { API, Characteristic, WithUUID } from 'homebridge'

export interface CustomCharacteristics {
  Voltage: WithUUID<new () => Characteristic>
  ProgramMode: WithUUID<new () => Characteristic>
}

export function createCustomCharacteristics(api: API): CustomCharacteristics {
  const { Formats, Perms } = api.hap

  // A read-only sensor value with a unit
  class Voltage extends api.hap.Characteristic {
    public static readonly UUID = 'E964F101-2A5C-4E11-9D5B-6AE10C2F13A7'

    constructor() {
      super('Voltage', Voltage.UUID, {
        format: Formats.FLOAT,
        unit: 'V',
        minValue: 0,
        maxValue: 400,
        minStep: 0.1,
        perms: [Perms.PAIRED_READ, Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
  }

  // A writable setting, constrained to a list of values
  class ProgramMode extends api.hap.Characteristic {
    public static readonly UUID = 'E964F102-2A5C-4E11-9D5B-6AE10C2F13A7'

    constructor() {
      super('Program Mode', ProgramMode.UUID, {
        format: Formats.UINT8,
        minValue: 0,
        maxValue: 2,
        validValues: [0, 1, 2],
        perms: [Perms.PAIRED_READ, Perms.PAIRED_WRITE, Perms.NOTIFY],
      })
      this.value = this.getDefaultValue()
    }
  }

  return { Voltage, ProgramMode }
}
```

Two details in there matter more than they look:

- **The `static readonly UUID` is load-bearing.** `service.getCharacteristic()` and `service.testCharacteristic()` match a characteristic _class_ by `instanceof` **or by its `UUID` property**. Characteristics restored from Homebridge's accessory cache are rebuilt as plain instances, so after a restart only the UUID match works — a class without the static property makes restored accessories behave differently from freshly-created ones.
- **The props are a contract.** Homebridge validates every value you write against `format`, `minValue`/`maxValue` and `validValues`, and logs a [characteristic warning](api/characteristic-warnings) naming your plugin when a value falls outside them. Choose ranges that fit the real hardware.

A custom service is the same idea — declare which characteristics it carries, and which are optional:

```ts
import type { API, Service, WithUUID } from 'homebridge'

export function createPowerMonitorService(
  api: API,
  characteristics: CustomCharacteristics,
): WithUUID<typeof Service> {
  class PowerMonitor extends api.hap.Service {
    public static readonly UUID = 'E964F201-2A5C-4E11-9D5B-6AE10C2F13A7'

    constructor(displayName?: string, subtype?: string) {
      super(displayName, PowerMonitor.UUID, subtype)
      this.addCharacteristic(characteristics.Voltage)
      this.addOptionalCharacteristic(characteristics.ProgramMode)
    }
  }
  return PowerMonitor
}
```

### Using them on an accessory

Custom types behave exactly like standard ones from here on — `addCharacteristic`, `onGet`/`onSet`, `updateCharacteristic`:

```ts
const custom = createCustomCharacteristics(this.api)

// Add to an existing standard service. The testCharacteristic guard matters
// on a restored accessory, which may already carry the characteristic from
// its previous life - adding it twice throws.
const outlet = accessory.getService(this.api.hap.Service.Outlet)!
if (!outlet.testCharacteristic(custom.Voltage)) {
  outlet.addCharacteristic(custom.Voltage)
}

outlet.getCharacteristic(custom.Voltage).onGet(async () => this.readVoltage())

// Push a new reading
outlet.updateCharacteristic(custom.Voltage, 233.5)
```

Custom characteristics are persisted in the accessory cache like everything else, so a [restored accessory](api/platform-plugins) comes back with them already attached — which is exactly why the guard above exists.

## The Eve conventions

Long before Matter, the Eve app established a set of custom characteristics that many plugins now share, all in the UUID range `E863Fxxx-079E-48FF-8F27-9C2605A29F52`. None of this is officially documented — it was reverse-engineered by the community — but it is stable, and using these UUIDs means the Eve app labels your values properly instead of showing a bare UUID.

The most commonly used ones:

| Characteristic    | UUID (`E863Fxxx-…`) | Format     | Meaning                                     |
| :---------------- | :------------------ | :--------- | :------------------------------------------ |
| Consumption       | `E863F10D`          | float, W   | Current power draw (Eve Energy)             |
| Total Consumption | `E863F10C`          | float, kWh | Lifetime energy total                       |
| Voltage           | `E863F10A`          | float, V   | Mains voltage                               |
| Electric Current  | `E863F126`          | float, A   | Current draw                                |
| Air Pressure      | `E863F10F`          | float, hPa | Barometric pressure (Eve Weather)           |
| VOC Level         | `E863F10B`          | int, ppb   | Air quality (Eve Room)                      |
| Last Activation   | `E863F11A`          | uint32     | Seconds since the accessory's history epoch |
| Times Opened      | `E863F129`          | uint32     | Contact sensor open counter (Eve Door)      |
| Valve Position    | `E863F12E`          | uint8, %   | Radiator valve position (Eve Thermo)        |

The Eve app's history graphs are their own rabbit hole: a custom `History` service (`E863F007`) whose characteristics (`E863F116`, `E863F117`, `E863F11C`, `E863F121`) stream measurement entries in a packed binary format. Nobody implements that by hand — use [fakegato-history](https://github.com/simont77/fakegato-history), which fabricates the whole protocol and pairs naturally with the characteristics above. Its wiki is also the best reference for the decoded Eve formats.

## Using homebridge-lib

[homebridge-lib](https://github.com/ebaauw/homebridge-lib) — the utility library behind ebaauw's plugins — packages both halves of this page so you do not have to hand-roll the classes.

For the Eve set, `EveHomeKitTypes` ships every characteristic in the table above (and many more), pre-built with the right formats, units and ranges:

One thing to know up front: homebridge-lib is written in JavaScript with JSDoc and ships no TypeScript declarations, so in a TS plugin the import resolves without types. A one-line declaration file keeps the compiler happy:

```ts
// src/homebridge-lib.d.ts
declare module 'homebridge-lib/EveHomeKitTypes'
declare module 'homebridge-lib/MyHomeKitTypes'
```

```ts
import type { API, Service } from 'homebridge'

import { EveHomeKitTypes } from 'homebridge-lib/EveHomeKitTypes'

export class ExamplePlatform {
  private readonly eve

  constructor(api: API) {
    this.eve = new EveHomeKitTypes(api)
  }

  configureOutlet(service: Service): void {
    const { Consumption, Voltage } = this.eve.Characteristics

    if (!service.testCharacteristic(Consumption)) {
      service.addCharacteristic(Consumption)
    }
    service.getCharacteristic(Voltage).onGet(async () => this.readVoltage())
  }
}
```

For your own types, `MyHomeKitTypes` wraps the subclassing into two calls — `createCharacteristicClass` and `createServiceClass` — with validation of the UUIDs and props thrown in:

```ts
import { MyHomeKitTypes } from 'homebridge-lib/MyHomeKitTypes'

const my = new MyHomeKitTypes(api)

// The UUIDs are yours to generate - one random base, counted up per type
my.createCharacteristicClass('LastUpdated', 'E964F301-2A5C-4E11-9D5B-6AE10C2F13A7', {
  format: my.Formats.STRING,
  perms: [my.Perms.PAIRED_READ, my.Perms.NOTIFY],
}, 'Last Updated')

my.createServiceClass('Status', 'E964F302-2A5C-4E11-9D5B-6AE10C2F13A7', [
  my.Characteristics.LastUpdated,
])

// Then use them like any other type
const service = accessory.getService(my.Services.Status)
  || accessory.addService(my.Services.Status)
service.updateCharacteristic(my.Characteristics.LastUpdated, new Date().toISOString())
```

## Which approach?

Both end in the same place — a subclass of the HAP characteristic or service registered under your UUID — so this is a dependency decision, not a capability one.

- **From scratch** costs ~15 lines per characteristic and adds nothing to your dependency tree. If you only need a handful of types, or you are already vendoring your history support, this is the lighter path.
- **homebridge-lib** earns its place when you want the full Eve vocabulary without transcribing UUID tables, or you are building several plugins that should share one set of types. Note it is an ESM-only package with its own release cadence, and it brings the rest of the library with it.

Either way, the rules are the same: pick UUIDs you own, set the static `UUID` property, keep the props honest, and never change a UUID after it ships.
