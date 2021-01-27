# Characteristics

### Characteristic.on
> Characteristic.on(event: "set" | "get", listener: (value?, callback) => void)

Subscribe to Characteristic events.

#### Set Event

The `set` event is typically called when the user changes the state of a device, for example, when turning on a switch.

The handler function contains two arguments:

* `value`: This the value device should be changed to.
* `callback(err)`: The callback function that should be called once the device state has been changed.

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .on('set', (value, callback) => {
    callback(null);
  });
```

#### Get Event

The `get` event is called when HomeKit wants get retrieve the current state of a device.

The handler function contains one argument:

* `callback(err, value)`: The callback function used to return the current state of the device.

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .on('get', (callback) => {
    const value = true;
    callback(null, value);
  });
```

Implementation of the get event handler is not the recommended method of updating a characteristics current value where the function is time or resource intensive and the use of [service.updateCharacteristic](https://github.com/homebridge/homebridge.github.io/blob/source/src/docs/api/service.md#serviceupdatecharacteristic) is recommended method.  The usage of [service.updateCharacteristic](https://github.com/homebridge/homebridge.github.io/blob/source/src/docs/api/service.md#serviceupdatecharacteristic) will provide a robust user experience with the real time updating of the characteristic in the Home app when viewing the accessory.

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
  });
```

### Characteristic.value
> Characteristic.value: CharacteristicValue

Returns the current value of the characteristic.
