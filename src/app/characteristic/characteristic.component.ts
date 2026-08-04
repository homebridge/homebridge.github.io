import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'

import { Characteristic, HapService, Service } from '../hap.service'

@Component({
  selector: 'app-characteristic',
  standalone: false,
  templateUrl: './characteristic.component.html',
  styleUrl: './characteristic.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class CharacteristicComponent implements OnInit {
  private currentRoute = inject(ActivatedRoute)
  private hapService = inject(HapService)
  private titleService = inject(Title)

  public characteristicName: string
  public characteristic: Characteristic

  public usedBy: Service[]

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe((params) => {
      this.characteristicName = params.get('characteristicName')
      this.characteristic = this.hapService.getCharacteristicsByName(
        this.characteristicName,
      )
      this.usedBy = this.hapService.getServiceTypesUsedByCharacteristic(
        this.characteristic.UUID,
      )

      this.titleService.setTitle(`Homebridge API - ${this.characteristicName}`)
    })
  }

  get characteristicPermissions() {
    return this.characteristic.props.perms
      .map(x => this.hapService.perms[x])
      .join(', ')
  }

  get characteristicEvents() {
    const events: string[] = []

    if (this.characteristic.props.perms.includes('pr')) {
      events.push('get')
    }

    if (this.characteristic.props.perms.includes('pw')) {
      events.push('set')
    }

    return events.join(', ')
  }
}
