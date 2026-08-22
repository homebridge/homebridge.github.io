# Characteristics

A characteristic is a single value inside a [service](api/service) — the `On` state of a switch, the `Brightness` of a light, the `CurrentTemperature` of a sensor. Each service type lists its required and optional characteristics under [Service Types](service).

## Reacting to the Home app

### Characteristic.onSet

> Characteristic.onSet((value) => Promise&lt;void&gt;): Characteristic

The `set` event is typically called when the user changes the state of a device within the Home app or an automation runs, for example, when turning on a switch.

The handler function contains one argument:

- `value`: This the value device should be changed to.

The handler function may optionally return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .onSet(async (value) => {
    console.log('new value', value)
  })
```

If the device cannot be reached, throw from the handler rather than returning quietly — a [HapStatusError](api/hap#apihaphapstatuserror) tells the Home app the command failed instead of leaving it showing a state the device never reached.

### Characteristic.onGet

> Characteristic.onGet(() => Promise&lt;value&gt;): Characteristic

The `get` event is called when HomeKit wants to retrieve the current state of a device.

The handler function must return the current state of the characteristic.

The handler function may optionally return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```ts
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .onGet(async () => {
    const isLightOn: boolean = true
    return isLightOn
  })
```

A `get` handler should be quick — HomeKit is waiting on it. If reading the real device is slow or rate-limited, leave the handler off entirely and push values with `updateValue` instead; the cached value answers reads immediately.

`Characteristic.removeOnGet()` and `Characteristic.removeOnSet()` detach handlers again, if your plugin needs to swap them at runtime.

## Pushing values to the Home app

### Characteristic.updateValue

> Characteristic.updateValue(value): Characteristic

Updates the characteristic value without triggering the "set" event handler. This can be used to update the state of a characteristic at any time, for example, when triggering a motion sensor. If your plugin uses updateValue to update state, you do not need to implement the onGet handler. Homebridge will cache the value and return the most recent value when a 'get' event is received from HomeKit.

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .updateValue(60)
```

### Characteristic.sendEventNotification

> Characteristic.sendEventNotification(value): Characteristic

Sets the value and **always** sends a notification, where `updateValue` only sends one when the value actually changed.

This matters for stateless characteristics such as `ProgrammableSwitchEvent`, where the same value repeats. Pressing a button twice with `updateValue` notifies HomeKit once, so the second press is silently lost — `sendEventNotification` reports both.

```js
service.getCharacteristic(this.api.hap.Characteristic.ProgrammableSwitchEvent)
  .sendEventNotification(this.api.hap.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS)
```

### Characteristic.setValue

> Characteristic.updateValue(value): Characteristic

<div class="alert alert-primary" role="alert">
In most cases you should use the <a href="/#/api/characteristics#characteristicupdatevalue">Characteristic.updateValue</a> method instead.
</div>

Set the characteristic value, also triggers the "set" event handler.

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .setValue(60)
```

### Characteristic.value

> Characteristic.value: CharacteristicValue

Returns the current value of the characteristic.

## Adjusting a characteristic

### Characteristic.setProps

> Characteristic.setProps: (props: Partial<CharacteristicProps>) => Characteristic

Update the properties for a characteristic, for example, adjust the minimum and maximum temperature ranges for a thermostat.

```js
accessory.getService(Service.Thermostat)
  .getCharacteristic(Characteristic.TargetTemperature)
  .setProps({
    minValue: 18,
    maxValue: 30,
    minStep: 1
  })
```

The properties worth setting from a plugin are:

| Property      | Use                                                                      |
| ------------- | ------------------------------------------------------------------------ |
| `minValue`    | Lowest value the device accepts                                          |
| `maxValue`    | Highest value the device accepts                                         |
| `minStep`     | Step size — `1` for whole degrees, `0.5` for half, and so on             |
| `validValues` | The only values the device supports, for characteristics that are a list |
| `maxLen`      | Character limit for a string characteristic (default 64, maximum 256)    |

Narrow the range to what the device really supports rather than widening it: HomeKit will happily send any value inside the range you declare, and a value the device rejects becomes an error the user sees.

`validValues` is the one to reach for when a device supports only some of the modes a characteristic defines — a heater-cooler that cannot cool, for example, should list only the modes it can actually enter.

### Reading the current properties

> Characteristic.props: CharacteristicProps

The characteristic's current properties, including its `format`, `unit` and permissions. Each characteristic's own page under [Service Types](service) lists its default values.

Two notes on units:

- **Temperatures are always in Celsius.** HAP has no other temperature unit — the Home app converts for display based on the iPhone's settings, so a plugin should never send Fahrenheit.
- Permissions are the `perms` array: `pr` paired read, `pw` paired write, `ev` event notifications.

## Older event API

### Characteristic.on

> Characteristic.on(event: "set" | "get", listener: (value?, callback) => void)

Subscribe to Characteristic events.

#### Set Event

<div class="alert alert-primary" role="alert">
Consider using the promise-based <a href="/#/api/characteristics#characteristiconset">Characteristic.onSet</a> method instead.
</div>

The `set` event is typically called when the user changes the state of a device, for example, when turning on a switch.

The handler function contains two arguments:

- `value`: This the value device should be changed to.
- `callback(err)`: The callback function that should be called once the device state has been changed.

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .on('set', (value, callback) => {
    callback(null)
  })
```

#### Get Event

<div class="alert alert-primary" role="alert">
Consider using the promise-based <a href="/#/api/characteristics#characteristiconget">Characteristic.onGet</a> method instead.
</div>

The `get` event is called when HomeKit wants to get retrieve the current state of a device.

The handler function contains one argument:

- `callback(err, value)`: The callback function used to return the current state of the device.

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .on('get', (callback) => {
    const value = true
    callback(null, value)
  })
```

Implementation of the get event handler is not the recommended method of updating a characteristics current value where the function is time or resource intensive; in such cases the [service.updateCharacteristic](#/api/service#serviceupdatecharacteristic) method should be used instead. Using the [service.updateCharacteristic](#/api/service#serviceupdatecharacteristic) method will provide a robust user experience with the real time updating of the characteristic in the Home app when viewing the accessory.
