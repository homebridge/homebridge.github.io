The full colour light: on/off, brightness, hue and saturation, XY colour, and white colour temperature.

Three colour handlers can be called, all carrying the `Logic` suffix:

- `colorControl.moveToHueAndSaturationLogic` — `hue` and `saturation`, both `0`–`254`
- `colorControl.moveToColorLogic` — `targetX` and `targetY`, both `0`–`65535` for a 0.0–1.0 CIE coordinate
- `colorControl.moveToColorTemperatureLogic` — `colorTemperatureMireds`

```js
const degrees = Math.round((hue / 254) * 360)
const percent = Math.round((saturation / 254) * 100)
```

**Update `colorMode` whenever you push colour state.** It tells the controller whether the light is currently showing a colour or a white temperature, and a stale value makes the Home app show the wrong control. The values are on `api.matter.types.ColorControl.ColorMode`: `CurrentHueAndCurrentSaturation`, `CurrentXAndCurrentY` and `ColorTemperatureMireds`.
