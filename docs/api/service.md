# Service

A service is one capability of a HAP accessory — a lightbulb, a switch, a temperature sensor. The values inside it are its [characteristics](api/characteristics).

Services are added to an accessory with [PlatformAccessory.addService](api/hap-platform-methods#platformaccessoryaddservice), and every service type Homebridge supports is listed under [Service Types](service), with the characteristics each one takes.

## Working with characteristics

### Service.getCharacteristic

> Service.getCharacteristic: (name: string | T) => Characteristic

Returns the requested Characteristic for the service.

```js
service.getCharacteristic(Characteristic.Brightness)
```

If the characteristic is not on the service yet but is an **optional** characteristic of that service type, it is added for you and returned. This is why attaching a handler to an optional characteristic works without adding it first:

```js
// Brightness is optional on a Lightbulb - this adds it, then attaches the handler
service.getCharacteristic(Characteristic.Brightness)
  .onSet(async (value) => {
    await myLightApi.setBrightness(value)
  })
```

Asking for a characteristic that belongs to neither the required nor the optional list still adds it, but logs a characteristic warning — usually a sign the wrong service type was chosen.

### Service.testCharacteristic

> Service.testCharacteristic: (name: string | T) => boolean

Returns whether the service already has the characteristic, without adding it. Use this when you need to check rather than create.

```js
if (service.testCharacteristic(Characteristic.Brightness)) {
  service.updateCharacteristic(Characteristic.Brightness, 60)
}
```

### Service.setCharacteristic

> Service.setCharacteristic: (name: string | T, value: CharacteristicValue) => Characteristic

<div class="alert alert-primary" role="alert">
  Calling <a href="/#/api/service#servicesetcharacteristic">Service.setCharacteristic</a> will trigger the "set" handler if it exists and may lead to unexpected results, depending on your use case, you may wish to use the 
  <a href="/#/api/service#serviceupdatecharacteristic">Service.updateCharacteristic</a> method instead.
</div>

Set the characteristic value.

```js
service.setCharacteristic(Characteristic.Name, 'Light Bulb 1')
```

### Service.updateCharacteristic

> Service.updateCharacteristic: (name: string | T, value: CharacteristicValue) => Characteristic

Updates the characteristic value. This can be used to update the state of a characteristic at any time, for example, when triggering a motion sensor.

```js
service.updateCharacteristic(Characteristic.Brightness, 60)
```

Can also be used to mark a service/accessory as 'Not Responding' in the Home App by returning an error object instead of a valid value. Only needs to be set on a single/primary characteristic of an accessory, and needs to be updated with a valid value when the accessory is available again. The error message text is for internal use only, and is not passed to the Home App.

```js
service.updateCharacteristic(Characteristic.Brightness, new Error('A placeholder error object'))
```

### Service.addOptionalCharacteristic

> Service.addOptionalCharacteristic: (characteristic: Characteristic | constructor) => void

Declares a characteristic as optional on this service, so a later `getCharacteristic` adds it without a warning. Rarely needed — the built-in service types already declare their own optional characteristics.

### Service.removeCharacteristic

> Service.removeCharacteristic: (characteristic: Characteristic) => void

Removes a characteristic from the service. Pass the characteristic itself, not its type.

## Service properties

### Service.displayName

> Service.displayName: string

The name given to the service when it was added. This is what the user sees for the service in the Home app, and what [PlatformAccessory.getService](api/hap-platform-methods#platformaccessorygetservice) matches on when passed a string.

### Service.subtype

> Service.subtype: string | undefined

The identifier given when adding more than one service of the same type to an accessory. Unlike the display name, it is not affected by the user renaming the service, which makes it the reliable way to find one — see [PlatformAccessory.getServiceById](api/hap-platform-methods#platformaccessorygetservicebyid).

### Service.UUID

> Service.UUID: string

The UUID of the service **type** — the same for every Lightbulb service, for instance. It is not a unique identifier for this particular service.

## Arranging services on an accessory

### Service.setPrimaryService

> Service.setPrimaryService(isPrimary?: boolean): void

Marks the service as the accessory's primary one — the capability the Home app leads with when an accessory has several services. An accessory can only have one primary service; setting a new one clears the old.

```js
service.setPrimaryService(true)
```

### Service.setHiddenService

> Service.setHiddenService(isHidden?: boolean): void

Hides the service from the Home app while leaving it in the accessory. Useful for a service that exists only to support another one.

### Service.addLinkedService

> Service.addLinkedService(service: Service): void

Links a related service to this one, which tells controllers the two belong together — a camera and its motion sensor, for example. The linked service must already be on the **same** accessory.

```js
cameraService.addLinkedService(motionService)
```

`Service.removeLinkedService(service)` undoes the link.
