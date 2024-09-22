# Characteristics

### Characteristic.onSet
> Characteristic.onSet((value) => Promise&lt;void&gt;): Characteristic

The `set` event is typically called when the user changes the state of a device within the Home app or an automation runs, for example, when turning on a switch.

The handler function contains one argument:

* `value`: This the value device should be changed to.

The handler function may optionally return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .onSet(async (value) => {
    console.log('new value', value);
  });
```

### Characteristic.onGet
> Characteristic.onGet(() => Promise&lt;value&gt;): Characteristic

The `get` event is called when HomeKit wants to retrieve the current state of a device.

The handler function must return the current state of the characteristic.

The handler function may optionally return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .onGet(async () => {
    const isLightOn: boolean = true;
    return isLightOn;
  });
```

### Characteristic.updateValue
> Characteristic.updateValue(value): Characteristic

Updates the characteristic value without triggering the "set" event handler. This can be used to update the state of a characteristic at any time, for example, when triggering a motion sensor. If your plugin uses updateValue to update state, you do not need to implement the onGet handler.  Homebridge will cache the value and return the most recent value when a 'get' event is received from HomeKit.

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .updateValue(60);
```

### Characteristic.setValue
> Characteristic.updateValue(value): Characteristic

<div class="alert alert-primary" role="alert">
In most cases you should use the <a href="/#/api/characteristics#characteristicupdatevalue">Characteristic.updateValue</a> method instead.
</div>

Set the characteristic value, also triggers the "set" event handler.

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .setValue(60);
```

### Characteristic.on
> Characteristic.on(event: "set" | "get", listener: (value?, callback) => void)

Subscribe to Characteristic events.

#### Set Event

<div class="alert alert-primary" role="alert">
Consider using the promise-based <a href="/#/api/characteristics#characteristiconset">Characteristic.onSet</a> method instead.
</div>

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

<div class="alert alert-primary" role="alert">
Consider using the promise-based <a href="/#/api/characteristics#characteristiconget">Characteristic.onGet</a> method instead.
</div>

The `get` event is called when HomeKit wants to get retrieve the current state of a device.

The handler function contains one argument:

* `callback(err, value)`: The callback function used to return the current state of the device.

```js
switchService.getCharacteristic(this.api.hap.Characteristic.On)
  .on('get', (callback) => {
    const value = true;
    callback(null, value);
  });
```

Implementation of the get event handler is not the recommended method of updating a characteristics current value where the function is time or resource intensive; in such cases the [service.updateCharacteristic](#/api/service#serviceupdatecharacteristic) method should be used instead. Using the [service.updateCharacteristic](#/api/service#serviceupdatecharacteristic) method will provide a robust user experience with the real time updating of the characteristic in the Home app when viewing the accessory.

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
