A heating and/or cooling thermostat.

**All temperatures are in hundredths of a degree Celsius.** `2000` is 20.00°C.

#### Declare only the setpoints the device really has

Homebridge works out which thermostat features to advertise from the setpoints you declare, so this is the most important decision on this device type:

| What you declare               | What the thermostat becomes     |
| ------------------------------ | ------------------------------- |
| `occupiedHeatingSetpoint` only | Heating                         |
| `occupiedCoolingSetpoint` only | Cooling                         |
| Both                           | Heating, cooling and auto mode  |
| Either `unoccupied*` setpoint  | Adds occupancy support          |
| No setpoints at all            | Heating (the spec requires one) |

A heat-only radiator valve should declare a heating setpoint and nothing else. Adding a cooling setpoint "just in case" makes it claim a capability it does not have, and the user gets controls that do nothing.

When declaring both, set `minSetpointDeadBand` — the smallest gap allowed between heating and cooling, in **tenths** of a degree, so `20` means 2.0°C.

⚠️ The deadband applies to the **setpoint limits**, not only to the setpoints. Both of these must hold, in hundredths of a degree:

```
maxCoolSetpointLimit - maxHeatSetpointLimit >= minSetpointDeadBand × 10
minCoolSetpointLimit - minHeatSetpointLimit >= minSetpointDeadBand × 10
```

The accessory is created either way, and then **every** setpoint change fails with `Thermostat setpoints could not be reconciled within the configured limits` while changing the system mode still works. The spec's absolute maxima are 30.00°C heating and 32.00°C cooling — a gap of exactly 2.0°C — so a thermostat using the full range cannot have a deadband above `20`. Homebridge warns about an impossible combination at startup.

#### localTemperature is read-only

`localTemperature` is the thermostat's own sensor reading and cannot be written. To report a temperature from a separate sensor, write `externalMeasuredIndoorTemperature` instead.

#### Handlers

Commands arrive as `thermostat.systemModeChange`, `thermostat.occupiedHeatingSetpointChange` and `thermostat.occupiedCoolingSetpointChange`. Each request carries both the new value and the old one.

`systemMode` values are on `api.matter.types.Thermostat.SystemMode` — `0` off, `1` auto, `3` cool, `4` heat.
