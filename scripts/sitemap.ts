import * as fs from 'fs';
import * as path from 'path';

const services = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/assets/services.json'), 'utf-8'));
const characteristics = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/assets/characteristics.json'), 'utf-8'));
const matterDeviceTypes = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/assets/matter-device-types.json'), 'utf-8'));

const baseUrl = 'https://developers.homebridge.io/#';

const sitemap = [
  'https://developers.homebridge.io/',
  baseUrl + '/',
  baseUrl + '/api/reference',
  baseUrl + '/api/accessory-plugins',
  baseUrl + '/api/platform-plugins',
  baseUrl + '/api/service',
  baseUrl + '/api/characteristics',
  baseUrl + '/api/log',
  baseUrl + '/api/matter',
  baseUrl + '/api/matter-clusters',
  baseUrl + '/config-schema',
  baseUrl + '/categories',
];

for (const service of services) {
  sitemap.push(baseUrl + '/service/' + service.name);
}

for (const characteristic of characteristics) {
  sitemap.push(baseUrl + '/characteristic/' + characteristic.name);
}

for (const deviceType of matterDeviceTypes) {
  sitemap.push(baseUrl + '/matter-device-type/' + deviceType.name);
}


fs.writeFileSync(path.resolve(__dirname, '../src/sitemap.txt'), sitemap.join('\n'), 'utf-8');
