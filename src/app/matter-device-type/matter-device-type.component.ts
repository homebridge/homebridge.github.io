import { HttpClient } from '@angular/common/http'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { MarkdownComponent } from 'ngx-markdown'

import { MatterDeviceType, MatterService } from '../matter.service'
import { PrismDirective } from '../prism.directive'

@Component({
  selector: 'app-matter-device-type',
  imports: [MarkdownComponent, PrismDirective, RouterLink],
  templateUrl: './matter-device-type.component.html',
  styleUrl: './matter-device-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatterDeviceTypeComponent implements OnInit {
  private currentRoute = inject(ActivatedRoute)
  private matterService = inject(MatterService)
  private titleService = inject(Title)
  private httpClient = inject(HttpClient)

  public readonly deviceTypeName = signal<string>('')
  public readonly deviceType = signal<MatterDeviceType | undefined>(undefined)
  public readonly exampleCode = signal<string | null>(null)
  public readonly notes = signal<string | null>(null)

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe((params) => {
      this.deviceTypeName.set(params.get('deviceTypeName') ?? '')
      this.deviceType.set(this.matterService.getDeviceTypeByName(
        this.deviceTypeName(),
      ))

      if (this.deviceType()) {
        this.generateExample()
        this.getNotes()
      }

      this.titleService.setTitle(`Homebridge API - ${this.deviceTypeName()}`)
    })
  }

  /**
   * Per-device-type notes are optional. A device type with nuances worth
   * knowing gets a markdown file of the same name, which is shown alongside
   * the generated clusters and example; the rest simply have none.
   */
  getNotes(): void {
    this.notes.set(null)
    this.httpClient
      .get(`/docs/matter-device-type/${this.deviceTypeName()}.md`, {
        responseType: 'text',
      })
      .subscribe({
        next: res => this.notes.set(res),
        error: () => this.notes.set(null),
      })
  }

  generateExample() {
    const deviceType = this.deviceType()
    if (!deviceType) {
      return
    }
    const clusters = deviceType.clusters

    const initialState = clusters
      .map((cluster) => {
        return `      ${cluster.id}: { ${cluster.exampleAttribute}: undefined }, // set a starting value`
      })
      .join('\n')

    // Only clusters that actually take commands get a handler block
    const handlers = clusters
      .filter(c => c.commands.length)
      .map((cluster) => {
        const commands = cluster.commands
          .slice(0, 2)
          .map((command) => {
            return `        ${command}: async () => {
          // tell your device to ${command}
        },`
          })
          .join('\n')

        return `      ${cluster.id}: {
${commands}
      },`
      })
      .join('\n')

    const firstCluster = clusters[0]

    this.exampleCode.set(`// Example ${deviceType.name} Matter plugin

module.exports = (api) => {
  api.registerPlatform('Example${deviceType.name}Plugin', Example${deviceType.name}Platform);
};

class Example${deviceType.name}Platform {

  constructor(log, config, api) {
    this.log = log;
    this.api = api;

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge');
        return;
      }

      const uuid = api.matter.uuid.generate('example-${deviceType.name.toLowerCase()}');

      await api.matter.registerPlatformAccessories('homebridge-example', 'Example${deviceType.name}Platform', [{
        UUID: uuid,
        displayName: 'Example ${deviceType.name}',
        deviceType: api.matter.deviceTypes.${deviceType.name},
        serialNumber: 'example-${deviceType.name.toLowerCase()}',
        manufacturer: 'Example Co',
        model: '${deviceType.name}',

        // the state a controller sees when the accessory first appears
        clusters: {
${initialState}
        },
${
  handlers
    ? `
        // called when a controller sends a command
        handlers: {
${handlers}
        },
`
    : ''
}      }]);

      this.uuid = uuid;
    });
  }
${
  firstCluster
    ? `
  /**
   * Call this when the device changes outside of Matter - from its own app,
   * a physical button, or a webhook
   */
  async syncFromDevice(value) {
    await this.api.matter.updateAccessoryState(
      this.uuid,
      this.api.matter.clusterNames.${firstCluster.name},
      { ${firstCluster.exampleAttribute}: value },
    );
  }
`
    : ''
}
  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName);
  }
}`)
  }
}
