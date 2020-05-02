import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { HapService, Characteristic, Service } from '../hap.service';

@Component({
  selector: 'app-characteristic',
  templateUrl: './characteristic.component.html',
  styleUrls: ['./characteristic.component.scss']
})
export class CharacteristicComponent implements OnInit {
  public characteristicName: string;
  public characteristic: Characteristic;

  public usedBy: Service[];

  constructor(
    private currentRoute: ActivatedRoute,
    private hapService: HapService,
    private titleService: Title,
  ) { }

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe(params => {
      this.characteristicName = params.get('characteristicName');
      this.characteristic = this.hapService.getCharacteristicsByName(this.characteristicName);
      this.usedBy = this.hapService.getServiceTypesUsedByCharacteristic(this.characteristic.UUID);

      this.titleService.setTitle(`Homebridge API - ${this.characteristicName}`);
    });
  }

  get characteristicPermissions() {
    return this.characteristic.props.perms.map(x => this.hapService.perms[x]).join(', ');
  }

}
