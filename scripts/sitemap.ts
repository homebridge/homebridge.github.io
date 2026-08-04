import * as fs from 'node:fs'
import * as path from 'node:path'

const services = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../src/assets/services.json'), 'utf-8'))
const characteristics = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../src/assets/characteristics.json'), 'utf-8'))
const matterDeviceTypes = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../src/assets/matter-device-types.json'), 'utf-8'))

const baseUrl = 'https://developers.homebridge.io/#'

const sitemap = [
  'https://developers.homebridge.io/',
  `${baseUrl}/`,
  `${baseUrl}/hap-vs-matter`,
  `${baseUrl}/api/reference`,
  `${baseUrl}/api/accessory-plugins`,
  `${baseUrl}/api/platform-plugins`,
  `${baseUrl}/api/best-practices`,
  `${baseUrl}/api/hap`,
  `${baseUrl}/api/hap-platform-methods`,
  `${baseUrl}/api/service`,
  `${baseUrl}/api/characteristics`,
  `${baseUrl}/api/log`,
  `${baseUrl}/api/matter`,
  `${baseUrl}/api/matter-platform-methods`,
  `${baseUrl}/api/matter-state`,
  `${baseUrl}/api/matter-errors`,
  `${baseUrl}/api/matter-devices`,
  `${baseUrl}/api/matter-clusters`,
  `${baseUrl}/config-schema`,
  `${baseUrl}/categories`,
]

for (const service of services) {
  sitemap.push(`${baseUrl}/service/${service.name}`)
}

for (const characteristic of characteristics) {
  sitemap.push(`${baseUrl}/characteristic/${characteristic.name}`)
}

for (const deviceType of matterDeviceTypes) {
  sitemap.push(`${baseUrl}/matter-device-type/${deviceType.name}`)
}

fs.writeFileSync(path.resolve(import.meta.dirname, '../src/sitemap.txt'), sitemap.join('\n'), 'utf-8')
