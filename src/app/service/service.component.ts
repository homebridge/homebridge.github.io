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

import { Characteristic, HapService, Service } from '../hap.service'
import { PrismDirective } from '../prism.directive'

@Component({
  selector: 'app-service',
  imports: [RouterLink, MarkdownComponent, PrismDirective],
  templateUrl: './service.component.html',
  styleUrl: './service.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ServiceComponent implements OnInit {
  private currentRoute = inject(ActivatedRoute)
  private hapService = inject(HapService)
  private titleService = inject(Title)
  private httpClient = inject(HttpClient)

  public readonly serviceName = signal<string>('')
  public readonly service = signal<Service>(undefined)

  public readonly requiredCharacteristics = signal<Characteristic[]>([])
  public readonly optionalCharacteristics = signal<Characteristic[]>([])

  public readonly exampleCode = signal<string>(null)
  public readonly markdown = signal<string>(null)

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe((params) => {
      this.serviceName.set(params.get('serviceName'))
      this.service.set(this.hapService.getServiceByName(this.serviceName()))

      this.requiredCharacteristics.set(this.service().requiredCharacteristics.map(
        x => this.hapService.getCharacteristicsByUUID(x),
      ))
      this.optionalCharacteristics.set(this.service().optionalCharacteristics.map(
        x => this.hapService.getCharacteristicsByUUID(x),
      ))

      this.getMarkdown()

      this.titleService.setTitle(`Homebridge API - ${this.serviceName()}`)
    })
  }

  getMarkdown() {
    this.markdown.set(null)
    this.exampleCode.set(null)
    this.httpClient
      .get(`/docs/service/${this.serviceName()}.md`, { responseType: 'text' })
      .subscribe(
        (res) => {
          this.markdown.set(res)
        },
        () => {
          this.generateExample()
        },
      )
  }

  generateExample() {
    this.exampleCode.set(`// Example ${this.service().displayName} Plugin

module.exports = (api) => {
  api.registerAccessory('Example${this.serviceName()}Plugin', Example${this.serviceName()}Accessory);
};

class Example${this.serviceName()}Accessory {

  constructor(log, config, api) {
      this.log = log;
      this.config = config;
      this.api = api;

      this.Service = this.api.hap.Service;
      this.Characteristic = this.api.hap.Characteristic;

      // extract name from config
      this.name = config.name;

      // create a new ${this.service().displayName} service
      this.service = new this.Service(this.Service.${this.serviceName()});

      // create handlers for required characteristics
${this.generateRequiredBindings(this.requiredCharacteristics())}
  }

${this.generateMethods(this.requiredCharacteristics())}
}`)
  }

  generateRequiredBindings(characteristics: Characteristic[]): string {
    return characteristics
      .filter(x => x.props.format !== 'tlv8')
      .map((x) => {
        return `      this.service.getCharacteristic(this.Characteristic.${x.name})
${this.generateGetHandler(x)}${this.generateSetHandler(x)}`
      })
      .join('\n')
  }

  generateGetHandler(characteristic: Characteristic): string {
    if (characteristic.props.perms.includes('pr')) {
      const value = `        .onGet(this.handle${characteristic.name}Get.bind(this))`
      return characteristic.props.perms.includes('pw')
        ? `${value}\n        `
        : `${value};\n`
    } else {
      return `        `
    }
  }

  generateSetHandler(characteristic: Characteristic): string {
    if (characteristic.props.perms.includes('pw')) {
      return `.onSet(this.handle${characteristic.name}Set.bind(this));\n`
    } else {
      return ``
    }
  }

  generateMethods(characteristics: Characteristic[]) {
    return characteristics
      .filter(x => x.props.format !== 'tlv8')
      .map((x) => {
        return `${this.generateGetMethod(x)}${this.generateSetMethod(x)}`
      })
      .join('\n')
  }

  generateGetMethod(characteristic: Characteristic) {
    if (characteristic.props.perms.includes('pr')) {
      return `  /**
   * Handle requests to get the current value of the "${characteristic.displayName}" characteristic
   */
  handle${characteristic.name}Get() {
    this.log.debug('Triggered GET ${characteristic.name}');

    // set this to a valid value for ${characteristic.name}
    const currentValue = ${characteristic.constValues.length ? `this.Characteristic.${characteristic.name}.${characteristic.constValues[0].key}` : characteristic.props?.minValue || '1'};

    return currentValue;
  }\n\n`
    } else {
      return ``
    }
  }

  generateSetMethod(characteristic: Characteristic) {
    if (characteristic.props.perms.includes('pw')) {
      return `  /**
   * Handle requests to set the "${characteristic.displayName}" characteristic
   */
  handle${characteristic.name}Set(value) {
    this.log.debug('Triggered SET ${characteristic.name}:' value);
  }\n`
    } else {
      return ``
    }
  }
}
