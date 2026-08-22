# Device Guides (Matter)

The generated [Device Types](matter-device-type) pages list every device type and the clusters each one carries. This page adds what those lists cannot: the per-family behaviour that is not obvious from the cluster names — which handler each command calls, the value scales, and the quirks that cost people time.

Each family links to the matching guide in the [homebridge-matter wiki](https://github.com/homebridge-plugins/homebridge-matter/wiki), which has complete worked examples for every device type — that plugin is the reference implementation for Matter in Homebridge.

## Lights

Four device types, in increasing capability: `OnOffLight`, `DimmableLight`, `ColorTemperatureLight` and `ExtendedColorLight`.

- Power commands arrive as `onOff.on` and `onOff.off` handlers.
- Brightness arrives as `levelControl.moveToLevelWithOnOff`, with a `level` of `1`–`254` — see [value ranges](api/matter-state#value-ranges).
- The colour handlers carry a `Logic` suffix: `colorControl.moveToColorTemperatureLogic`, `moveToHueAndSaturationLogic` and `moveToColorLogic` (XY colour).
- Colour temperature is in mireds, hue and saturation are `0`–`254` — the conversions are in [value ranges](api/matter-state#value-ranges).
- On an `ExtendedColorLight`, update `colorMode` alongside the colour values when pushing state, so the controller knows whether the light is currently in colour or white mode.

Full examples: [Lighting Devices](https://github.com/homebridge-plugins/homebridge-matter/wiki/Section-4-Lighting) in the homebridge-matter wiki.

## Smart plugs and outlets

`OnOffOutlet` works exactly like `OnOffLight` — `onOff.on` and `onOff.off` handlers — it just appears as a plug.

From Homebridge 2.2.0 an outlet can also report **power and energy**. Declare `electricalPowerMeasurement` and/or `electricalEnergyMeasurement` cluster state and Homebridge does the rest — it adds the required `ElectricalSensor` device type to the endpoint and fills in the mandatory accuracy metadata. Things to know:

- The units are raw Matter units: millivolts, milliamps, milliwatts and milliwatt-hours. `60_000` milliwatts is a 60W load.
- Set a measurement to `null` to say "no reading available right now".
- Keep cumulative energy updates to a sane cadence — roughly once a minute. Every update emits a measurement event to subscribed controllers.

Full examples: [Smart Plugs](https://github.com/homebridge-plugins/homebridge-matter/wiki/Section-5-Smart-Plugs) in the homebridge-matter wiki.

## Switches and buttons

Two very different device types cover "switch":

- **`OnOffSwitch`** is for a switch with real state, such as a wall switch controlling a load. It works like a light: `onOff.on` and `onOff.off` handlers.
- **`GenericSwitch`** is for stateless buttons and remotes. It has **no handlers at all** — nothing in the Home app turns a button on. Instead your plugin fires events through [`api.matter.switch`](api/matter-state#apimatterswitch) when the physical button is pressed.

For a `GenericSwitch`, `numberOfPositions` counts the released state: a single button is `2`, a three-button remote is `4`, and the `position` option selects the button when emitting. Several buttons can also be modelled as separate [parts](api/matter-platform-methods#composed-accessories) of one accessory instead.

Full examples: [Switches & Controllers](https://github.com/homebridge-plugins/homebridge-matter/wiki/Section-6-Switches) in the homebridge-matter wiki.

## Sensors

Sensors declare no handlers — they only push readings with [`updateAccessoryState()`](api/matter-state#apimatterupdateaccessorystate). The units are where the surprises live:

- **Temperature** (`temperatureMeasurement.measuredValue`) is in hundredths of °C: `2500` is 25.00°C.
- **Humidity** (`relativeHumidityMeasurement.measuredValue`) is in hundredths of a percent: `5500` is 55.00%.
- **Light level** (`illuminanceMeasurement.measuredValue`) is on a logarithmic scale: `Math.round(10000 * Math.log10(lux))`, and back with `10 ** (value / 10000)`.
- **Occupancy** — the device type is called `MotionSensor`, but it is an occupancy sensor, and that is how controllers present it. The reading is `occupancySensing.occupancy.occupied`, a boolean.
- **Air quality** (`airQuality.airQuality`) is an enum from `0` (unknown) to `6` (extremely poor). An `AirQualitySensor` also carries PM2.5, PM10, temperature and humidity clusters, but Apple Home currently shows only the air quality rating — other controllers can read the rest.
- Any sensor can also declare a `PowerSource` cluster to show a battery level — see [reporting a battery](api/matter-state#reporting-a-battery).

Full examples: [Sensors](https://github.com/homebridge-plugins/homebridge-matter/wiki/Section-7-Sensors) in the homebridge-matter wiki.

## Locks and window coverings

**`DoorLock`** commands arrive as `doorLock.lockDoor` and `doorLock.unlockDoor` handlers, each with an optional `pinCode` in the request. State is `lockState`: `0` not fully locked, `1` locked, `2` unlocked — the enums are on `api.matter.types.DoorLock`.

**`WindowCovering`** has inverted position semantics, and this catches nearly everyone:

- `0` means fully **open**, `10000` means fully **closed**, in hundredths of a percent.
- So "75% open" is `targetPositionLiftPercent100ths: 2500` — invert, then multiply by 100.

Position commands arrive as `windowCovering.goToLiftPercentage` (with `liftPercent100thsValue`), plus `upOrOpen`, `downOrClose` and `stopMotion`. Tilt attributes exist too, only for coverings that support tilt.

Full examples: [Closure Devices](https://github.com/homebridge-plugins/homebridge-matter/wiki/Section-8-Closure) in the homebridge-matter wiki.

## Thermostats and fans

**`Thermostat`** temperatures are in hundredths of °C, like temperature sensors. Two things matter most:

- **Declare only the setpoints the device really has.** Homebridge derives the thermostat's capabilities from them: a heating setpoint gives a heat-only thermostat, a cooling setpoint cool-only, both gives heating, cooling and auto mode. Declaring a cooling setpoint "just in case" makes the device claim a capability it does not have.
- `localTemperature` is read-only. A plugin pushing readings from an external sensor writes `externalMeasuredIndoorTemperature` instead.

Commands arrive as `systemModeChange`, `occupiedHeatingSetpointChange` and `occupiedCoolingSetpointChange` handlers, each with the new and old value. When declaring both setpoints, also set `minSetpointDeadBand` — the minimum gap between them, in tenths of °C. ⚠️ That gap is required between the setpoint **limits** too (`maxCoolSetpointLimit - maxHeatSetpointLimit` and the matching `min` pair), which is easy to miss: get it wrong and the accessory registers fine, then every setpoint change is rejected while the system mode still changes normally.

From Homebridge v2.4.0, feature combinations the detection cannot infer — a thermostat with heating and cooling but **no auto mode**, say — can be composed directly with `api.matter.deviceRequirements`, and Homebridge uses those choices as given: see [Customising features on Thermostat](matter-device-type/Thermostat) and the [Customising Features guide](https://github.com/homebridge-plugins/homebridge-matter/wiki/Customising-Features) in the homebridge-matter wiki.

**`Fan`** commands arrive as `fanControl.fanModeChange` and `fanControl.percentSettingChange`. The `percentSetting` doubles as power control: `0` is off, `1`–`100` is on at that speed. The mode enum is on `api.matter.types.FanControl.FanMode`.

Full examples: [HVAC Devices](https://github.com/homebridge-plugins/homebridge-matter/wiki/Section-9-HVAC) in the homebridge-matter wiki.

## Robot vacuums

`RoboticVacuumCleaner` is the most involved device type, and the only one that is [published on its own Matter server](api/matter-platform-methods#accessories-that-get-their-own-bridge) rather than inside the bridge — users pair it separately, with its own QR code from the Homebridge log.

It combines run-mode, clean-mode and operational-state clusters, and normally a `PowerSource` cluster for the battery. Rather than repeating the full cluster tables here, work from the complete example: [Robotic Vacuum Cleaner](https://github.com/homebridge-plugins/homebridge-matter/wiki/Section-12-Robotic) in the homebridge-matter wiki.
