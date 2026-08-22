A pump — pool, circulation or similar.

Homebridge configures the pump for **constant speed** operation, which is the mode that matches an on/off or level-controlled pump bridged from an existing API. The `OnOff` cluster switches it, and `LevelControl` sets the level where the pump supports one.

The `PumpConfigurationAndControl` cluster carries the pump's own reporting — `pumpStatus` for fault and running state, plus capacity and speed attributes where the hardware provides them.
