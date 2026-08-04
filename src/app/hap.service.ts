import { HttpClient } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'

export interface Service {
  name: string
  displayName: string
  UUID: string
  requiredCharacteristics: string[]
  optionalCharacteristics: string[]
}

export interface Characteristic {
  name: string
  displayName: string
  UUID: string
  props: {
    format: string
    unit: string
    minValue: number
    maxValue: number
    minStep: number
    perms: string[]
  }
  constValues: {
    key: string
    value: string
  }[]
  validValues?: number[]
}

export interface Categories {
  id: number
  name: string
}

@Injectable({
  providedIn: 'root',
})
export class HapService {
  private httpClient = inject(HttpClient)

  public readonly ready = signal(false)
  public readonly services = signal<Service[]>([])
  public readonly characteristics = signal<Characteristic[]>([])
  public readonly categories = signal<Categories[]>([])

  public perms = {
    pr: 'Paired Read',
    pw: 'Paired Write',
    ev: 'Events',
    aa: 'Additional Authorization',
    tw: 'Timed Write',
    hd: 'Hidden',
    wr: 'Write Response',
  }

  constructor() {
    this.load()
  }

  load() {
    Promise.all([
      this.httpClient.get('assets/services.json').toPromise(),
      this.httpClient.get('assets/characteristics.json').toPromise(),
      this.httpClient.get('assets/categories.json').toPromise(),
    ]).then(([services, characteristics, categories]) => {
      this.services.set(services as Service[])
      this.characteristics.set(characteristics as Characteristic[])
      this.categories.set(categories as Categories[])
      this.ready.set(true)
    })
  }

  getServiceByName(serviceName: string) {
    return this.services().find(x => x.name === serviceName)
  }

  getServiceByUUID(uuid: string) {
    return this.services().find(x => x.UUID === uuid)
  }

  getCharacteristicsByName(characteristicName: string) {
    return this.characteristics().find(x => x.name === characteristicName)
  }

  getCharacteristicsByUUID(uuid: string) {
    return this.characteristics().find(x => x.UUID === uuid)
  }

  getServiceTypesUsedByCharacteristic(uuid: string) {
    const required = this.services().filter(x => x.requiredCharacteristics.includes(uuid))
    const optional = this.services().filter(x => x.optionalCharacteristics.includes(uuid))
    return required.concat(optional)
  }
}
