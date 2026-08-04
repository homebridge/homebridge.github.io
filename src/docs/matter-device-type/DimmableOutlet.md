An outlet with a level as well as on/off, for a plug that dims whatever is connected to it.

The level works exactly as it does on [DimmableLight](matter-device-type/DimmableLight): a `levelControl.moveToLevelWithOnOff` handler, with `level` running from **1 to 254** rather than 0 to 100.

Like [OnOffOutlet](matter-device-type/OnOffOutlet), it can also report power and energy by declaring the electrical measurement clusters.
