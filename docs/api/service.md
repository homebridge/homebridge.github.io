# Service

### Service.getCharacteristic
> Service.getCharacteristic: (name: string | T) => Characteristic

Returns the requested Characteristic for the service.

```js
service.getCharacteristic(Characteristic.Brightness);
```

### Service.setCharacteristic
> Service.setCharacteristic: (name: string | T, value: CharacteristicValue) => Characteristic

<div class="alert alert-primary" role="alert">
  Calling <a href="/#/api/reference#Service.setCharacteristic">Service.setCharacteristic</a> will trigger the "set"handler if it exists and may lead to unexpected results, depending on your use case, you may wish to use the 
  <a href="/#/api/reference#Service.updateCharacteristic">Service.updateCharacteristic</a> method instead.
</div>

Set the characteristic value.

```js
service.setCharacteristic(Characteristic.Name, 'Light Bulb 1');
```

### Service.updateCharacteristic
> Service.updateCharacteristic: (name: string | T, value: CharacteristicValue) => Characteristic

Updates the characteristic value. This can be used to update the state of a characteristic at any time, for example, when triggering a motion sensor.

```js
service.updateCharacteristic(Characteristic.Brightness, 60);
```
