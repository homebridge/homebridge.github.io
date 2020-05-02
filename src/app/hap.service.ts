import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Service {
  name: string;
  displayName: string;
  UUID: string;
  requiredCharacteristics: string[];
  optionalCharacteristics: string[];
}

export interface Characteristic {
  name: string;
  displayName: string;
  UUID: string;
  props: {
    format: string;
    unit: string;
    minValue: number,
    maxValue: number,
    minStep: number,
    perms: string[],
  };
  constValues: {
    key: string,
    value: string,
  }[];
  validValues?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class HapService {
  public ready = false;
  public services: Service[];
  public characteristics: Characteristic[];

  public perms = {
    pr: 'Paired Read',
    pw: 'Paired Write',
    ev: 'Events',
    aa: 'Additional Authorization',
    tw: 'Timed Write',
    hd: 'Hidden',
    wr: 'Write Response',
  }

  constructor(
    private httpClient: HttpClient,
  ) {
    this.load();
  }

  load() {
    Promise.all([
      this.httpClient.get('assets/services.json').toPromise(),
      this.httpClient.get('assets/characteristics.json').toPromise(),
    ]).then(([services, characteristics]) => {
      this.services = services as Service[];
      this.characteristics = characteristics as Characteristic[];
      this.ready = true;
    });
  }

  getServiceByName(serviceName: string) {
    return this.services.find(x => x.name === serviceName);
  }

  getServiceByUUID(uuid: string) {
    return this.services.find(x => x.UUID === uuid);
  }

  getCharacteristicsByName(characteristicName: string) {
    return this.characteristics.find(x => x.name === characteristicName);
  }

  getCharacteristicsByUUID(uuid: string) {
    return this.characteristics.find(x => x.UUID === uuid);
  }

  getServiceTypesUsedByCharacteristic(uuid: string) {
    const required = this.services.filter(x => x.requiredCharacteristics.includes(uuid));
    const optional = this.services.filter(x => x.optionalCharacteristics.includes(uuid));
    return required.concat(optional);
  }
}
