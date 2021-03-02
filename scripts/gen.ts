import * as hap from 'hap-nodejs';
import { Service, Characteristic, Accessory } from 'hap-nodejs';
import decamelize from 'decamelize';
import * as inflection from 'inflection';
import * as uuid from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const categories = [];
const services = [];
const characteristics = [];

const hiddenServices = [
  'CameraControl',
];

// tslint:disable-next-line: forin
for (const prop in (hap as any)['Categories']) {
  if (typeof (hap as any)['Categories'][prop] === 'number') {
    categories.push({
      name: prop,
      id: (hap as any)['Categories'][prop],
    });
  }
}

for (const [name, value] of Object.entries(Service)) {
  if (value.UUID) {
    try {
      let service: Service;

      if (name === 'AccessoryInformation') {
        const accessory = new Accessory('myname', uuid.v4());
        service = accessory.getService(Service.AccessoryInformation);
      } else {
        service = new Service[name]();
      }

      const payload = {
        name: service.constructor.name,
        displayName: inflection.titleize(decamelize(service.constructor.name)).replace('Wi Fi', 'WiFi'),
        UUID: service.UUID,
        requiredCharacteristics: service.characteristics.map(x => x.UUID),
        optionalCharacteristics: service.optionalCharacteristics.map(x => x.UUID),
      };

      if (!services.find(x => x.name === payload.name)) {
        services.push(payload);
      }
    } catch (e) {
      console.log(e);
      console.log(`Failed to get ${name}`);
    }
  }
}

for (const [name, value] of Object.entries(Characteristic)) {
  if (value.UUID) {
    const characteristic = new Characteristic[name]();

    const payload = {
      name: characteristic.constructor.name,
      displayName: characteristic.displayName,
      UUID: characteristic.UUID,
      props: characteristic.props,
      constValues: Object.entries(Characteristic[name]).filter(([x, y]) => x !== 'UUID').map(([x, y]) => ({ key: x, value: y })),
    };

    if (!characteristics.find(x => x.name === payload.name)) {
      characteristics.push(payload);
    }
  }
}

const sortedcategories = categories.sort((a, b) => (a.id > b.id) ? 1 : -1);
const sortedServices = services.filter(x => !hiddenServices.includes(x.name)).sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);
const sortedCharacteristics = characteristics.sort((a, b) => (a.displayName > b.displayName) ? 1 : -1);

fs.writeFileSync(path.resolve(__dirname, '../src/assets/categories.json'), JSON.stringify(sortedcategories, null, 4));
fs.writeFileSync(path.resolve(__dirname, '../src/assets/services.json'), JSON.stringify(sortedServices, null, 4));
fs.writeFileSync(path.resolve(__dirname, '../src/assets/characteristics.json'), JSON.stringify(sortedCharacteristics, null, 4));
