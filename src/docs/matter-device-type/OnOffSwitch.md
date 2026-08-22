A switch that holds a real on/off state — a wall switch controlling a load, for example.

It works like [OnOffLight](matter-device-type/OnOffLight): `onOff.on` and `onOff.off` handlers.

**For a button or remote that fires events rather than holding state, use [GenericSwitch](matter-device-type/GenericSwitch) instead.** Choosing this type for a stateless button gives the user a switch that appears stuck on or off.
