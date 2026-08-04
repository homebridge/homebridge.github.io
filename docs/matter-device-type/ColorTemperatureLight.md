On/off, brightness, and white colour temperature — a tuneable-white light with no colour.

Colour temperature arrives as a `colorControl.moveToColorTemperatureLogic` handler. Note the `Logic` suffix: it is easy to look for a handler named after the Matter command and find nothing.

**Temperature is in mireds, not kelvin**, and mireds are reciprocal — a _larger_ mired value is a _warmer_ light. The same formula converts both ways:

```js
const mireds = Math.round(1000000 / kelvin)
const kelvin = Math.round(1000000 / mireds)
```

For reference: 2700K warm white is 370 mireds, 4000K neutral is 250, and 6500K daylight is about 154. The usual supported span is roughly 147 to 454.

Declare `colorTempPhysicalMinMireds` and `colorTempPhysicalMaxMireds` to match what the bulb actually supports, so a controller does not offer a warmth the hardware cannot reach.
