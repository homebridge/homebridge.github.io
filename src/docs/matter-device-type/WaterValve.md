A water valve — an irrigation valve or a smart tap.

Commands arrive as `valveConfigurationAndControl.open` and `valveConfigurationAndControl.close` handlers.

Homebridge supplies a default valve implementation, because the underlying matter.js server leaves open and close unimplemented. That default reflects the command back into the cluster state, so a valve works sensibly even before you add handlers — but you still need handlers to drive the real hardware.

`currentState` and `targetState` report where the valve is and where it is heading; a valve that takes time to move should show both while it travels.

If the valve reports how much it is open rather than just open or shut, use `currentLevel` and `targetLevel` as a percentage.
