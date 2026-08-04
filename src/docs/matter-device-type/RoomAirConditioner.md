A room air conditioning unit — a thermostat plus fan control in one device type.

Homebridge enables **both heating and cooling** on this device type, so a reverse-cycle unit that also heats works, and a cooling-only unit simply leaves the heating attributes at their defaults.

Temperatures are in hundredths of a degree Celsius, and the setpoint and system-mode handlers work exactly as they do on [Thermostat](matter-device-type/Thermostat).

The fan side uses the `FanControl` cluster — see [Fan](matter-device-type/Fan) for how `percentSetting` and `fanMode` behave.
