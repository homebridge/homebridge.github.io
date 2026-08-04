import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterLink } from '@angular/router'

import { Characteristic, HapService, Service } from '../hap.service'

@Component({
  selector: 'app-characteristic',
  imports: [RouterLink],
  templateUrl: './characteristic.component.html',
  styleUrl: './characteristic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacteristicComponent implements OnInit {
  private currentRoute = inject(ActivatedRoute)
  private hapService = inject(HapService)
  private titleService = inject(Title)

  public readonly characteristicName = signal<string>('')
  public readonly characteristic = signal<Characteristic>(undefined)

  public readonly usedBy = signal<Service[]>([])

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe((params) => {
      this.characteristicName.set(params.get('characteristicName'))
      this.characteristic.set(this.hapService.getCharacteristicsByName(
        this.characteristicName(),
      ))
      this.usedBy.set(this.hapService.getServiceTypesUsedByCharacteristic(
        this.characteristic().UUID,
      ))

      this.titleService.setTitle(`Homebridge API - ${this.characteristicName()}`)
    })
  }

  public readonly characteristicPermissions = computed(() => {
    return this.characteristic().props.perms.map(x => this.hapService.perms[x]).join(', ')
  })

  public readonly characteristicEvents = computed(() => {
    const events: string[] = []

    if (this.characteristic().props.perms.includes('pr')) {
      events.push('get')
    }

    if (this.characteristic().props.perms.includes('pw')) {
      events.push('set')
    }

    return events.join(', ')
  })
}
