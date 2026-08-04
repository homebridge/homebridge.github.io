import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, RouterLink } from '@angular/router'

import { MatterDeviceType, MatterService } from '../matter.service'
import { PrismDirective } from '../prism.directive'

@Component({
  selector: 'app-matter-device-type',
  imports: [PrismDirective, RouterLink],
  templateUrl: './matter-device-type.component.html',
  styleUrl: './matter-device-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatterDeviceTypeComponent implements OnInit {
  private currentRoute = inject(ActivatedRoute)
  private matterService = inject(MatterService)
  private titleService = inject(Title)

  public readonly deviceTypeName = signal<string>('')
  public readonly deviceType = signal<MatterDeviceType>(undefined)
  public readonly exampleCode = signal<string>(null)

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe((params) => {
      this.deviceTypeName.set(params.get('deviceTypeName'))
      this.deviceType.set(this.matterService.getDeviceTypeByName(
        this.deviceTypeName(),
      ))

      if (this.deviceType()) {
        this.generateExample()
      }

      this.titleService.setTitle(`Homebridge API - ${this.deviceTypeName()}`)
    })
  }

  /**
   * The first attribute of a cluster is its primary one (onOff, currentLevel,
   * and so on), which is what an example wants to show.
   */
  primaryAttribute(clusterIndex: number): string {
    return this.deviceType().clusters[clusterIndex]?.attributes[0]
  }

  generateExample() {
    const deviceType = this.deviceType()
    const clusters = deviceType.clusters

    const initialState = clusters
      .map((cluster) => {
        return `      ${cluster.id}: { ${cluster.attributes[0]}: undefined }, // set a starting value`
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
      { ${firstCluster.attributes[0]}: value },
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
