On/off plus a brightness level.

Brightness arrives as a `levelControl.moveToLevelWithOnOff` handler, whose request carries `level` and `transitionTime`.

**The level runs from 1 to 254, not 0 to 100.** Convert on the way in and out:

```js
const percent = Math.round((level / 254) * 100)
const level = Math.max(1, Math.round((percent / 100) * 254))
```

Zero is reserved, which is why the conversion clamps to a minimum of 1. A light at 0% is off — switch it with the `OnOff` cluster rather than setting a brightness of zero.
