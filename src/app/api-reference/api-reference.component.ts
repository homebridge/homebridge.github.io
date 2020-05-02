import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-api-reference',
  templateUrl: './api-reference.component.html',
  styleUrls: ['./api-reference.component.scss']
})
export class ApiReferenceComponent implements OnInit {

  constructor(
    private currentRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.currentRoute.params.subscribe((params) => {
      if (params.anchor) {
        setTimeout(() => {
          const el = document.getElementById(params.anchor);
          window.scrollTo(0, el.offsetTop + el.offsetHeight - 40)
        });
      }
    });
  }

  get registerAccessoryExample() {
    return `module.exports = (api) => {
  api.registerAccessory('ExampleAccessoryName', ExampleAccessoryPlugin);
}

class ExampleAccessoryPlugin {
  constructor(log, config, api) {
    log.debug('Example Accessory Plugin Loaded');
  }
}`
  }

  get registerPlatformExample() {
    return `module.exports = (api) => {
  api.registerPlatform('ExamplePlatformName', ExamplePlatformPlugin);
}

class ExamplePlatformPlugin {
  constructor(log, config, api) {
    log.debug('Example Platform Plugin Loaded');
  }
}`
  }

  get registerPlatformAccessoriesExample() {
    return `class ExamplePlatformPlugin {
  constructor(log, config, api) {

    // store restored cached accessories here
    this.accessories = [];

    /**
     * Platforms should wait until the "didFinishLaunching" event has fired before
     * registering any new accessories.
     */
    api.on('didFinishLaunching', () => {
      const uuid = api.hap.uuid.generate('SOMETHING UNIQUE');

      // check the accessory was not restored from cache
      if (!this.accessories.find(accessory => accessory.UUID === uuid)) {

        // create a new accessory
        const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid);

        // register the accessory
        api.registerPlatformAccessories('PLUGIN_NAME', 'PLATFORM_NAME', [accessory]);
      }
    });
  }

  /**
   * Homebridge will call the "configureAccessory" method once for every cached
   * accessory restored
   */
  configureAccessory(accessory) {
    this.accessories.push(accessory);
  }
}`
  }

  get unregisterPlatformAccessoriesExample() {
    return `class ExamplePlatformPlugin {
  constructor(log, config, api) {

    // store restored cached accessories here
    this.accessories = [];

    /**
     * Platforms should wait until the "didFinishLaunching" event has fired before
     * registering any new accessories.
     */
    api.on('didFinishLaunching', () => {
      // for the example just remove the first restored cached accessory
      const accessory = this.accessories[0];

      api.unregisterPlatformAccessories('PLUGIN_NAME', 'PLATFORM_NAME', [accessory]);
    });
  }

  /**
   * Homebridge will call the "configureAccessory" method once for every cached
   * accessory restored
   */
  configureAccessory(accessory) {
    this.accessories.push(accessory);
  }
}`
  }

  get userStoragePathExample() {
    return `class ExamplePlatformPlugin {
  constructor(log, config, api) {
    const storagePath = api.user.storagePath();
  }
}`
  }

  get userConfigPathExample() {
    return `class ExamplePlatformPlugin {
  constructor(log, config, api) {
    const configPath = api.user.configPath();
  }
}`
  }

  get hapServiceExample() {
    return `class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.api = api;

    const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid);

    // get the LightBulb service if it exists
    let service = accessory.getService(this.api.hap.Service.Lightbulb);

    // otherwise create a new LightBulb service
    if (!service) {
      service = accessory.addService(this.api.Service.Lightbulb);
    }
  }
}`
  }

  get hapAddServiceSubtypeExample() {
    return `const service1 = accessory.addService(Service.Lightbulb, 'Light Bulb 1', 'USER_DEFINED_SUBTYPE');`
  }

  get hapGetServiceExample() {
    return `const service = accessory.getService(this.api.hap.Service.Lightbulb);`
  }


  get hapGetServiceSubtypeExample() {
    return `const service1 = accessory.getService('Light Bulb 1');`
  }

  get platformAccessoryExample() {
    return `class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.api = api;

    const uuid = this.api.hap.uuid.generate('SOMETHING UNIQUE');
    const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid);
  }
}`
  }

  get platformAccessoryContextExample() {
    return `class ExamplePlatformPlugin {
  constructor(log, config, api) {
    this.api = api;

    const uuid = this.api.hap.uuid.generate('SOMETHING UNIQUE');
    const accessory = new this.api.platformAccessory('DISPLAY NAME', uuid);

    // data stored on the context object will persist through restarts
    accessory.context.myData = 'anything';
  }
}`
  }

  get serviceGetCharacteristicExample() {
    return `service.getCharacteristic(Characteristic.Brightness);`
  }

  get serviceSetCharacteristicExample() {
    return `service.setCharacteristic(Characteristic.Name, 'Light Bulb 1');`
  }


  get serviceUpdateCharacteristicExample() {
    return `service.updateCharacteristic(Characteristic.Brightness, 60);`
  }

}
