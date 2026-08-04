import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface MatterCluster {
  name: string;
  id: string;
  attributes: string[];
  commands: string[];
}

export interface MatterDeviceType {
  name: string;
  matterName: string;
  deviceTypeId: number;
  deviceTypeHex: string;
  deviceRevision: number;
  clusters: MatterCluster[];
}

/**
 * Matter device types, generated from Homebridge's own exports by
 * scripts/gen-matter.ts. Kept separate from HapService since the two protocols
 * are independent - a bridge may have either, both or neither enabled.
 */
@Injectable({
  providedIn: 'root',
})
export class MatterService {
  public ready = false;
  public deviceTypes: MatterDeviceType[] = [];

  constructor(
    private httpClient: HttpClient,
  ) {
    this.load();
  }

  load() {
    this.httpClient.get('assets/matter-device-types.json').toPromise().then((deviceTypes) => {
      this.deviceTypes = deviceTypes as MatterDeviceType[];
      this.ready = true;
    });
  }

  getDeviceTypeByName(name: string) {
    return this.deviceTypes.find(x => x.name === name);
  }
}
