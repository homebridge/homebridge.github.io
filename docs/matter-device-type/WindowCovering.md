Blinds, shades, curtains and awnings.

**Positions are inverted, and in hundredths of a percent.** This is the single most common mistake with this device type:

- `0` means fully **open**
- `10000` means fully **closed**

So "75% open" is `2500`. Convert in both directions:

```js
const matterValue = Math.round((100 - openPercent) * 100)
const openPercent = 100 - (matterValue / 100)
```

The attributes are `currentPositionLiftPercent100ths` and `targetPositionLiftPercent100ths`. Update both — the current position is where the covering is, the target is where it is heading, and a controller uses the difference to show that it is still moving.

Four handlers can be called:

- `windowCovering.goToLiftPercentage` — carries `liftPercent100thsValue`, in the inverted scale above
- `windowCovering.upOrOpen` and `windowCovering.downOrClose` — full open and full close
- `windowCovering.stopMotion` — stop where it is

#### Tilt

Venetian blinds that tilt also carry `currentPositionTiltPercent100ths` and `targetPositionTiltPercent100ths`, on the same `0`–`10000` scale, where `0` is horizontal and `10000` is fully closed. Leave the tilt attributes out entirely for a covering that does not tilt.
