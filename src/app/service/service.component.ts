import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { HapService, Service, Characteristic } from '../hap.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {
  public serviceName: string;
  public service: Service;

  public requiredCharacteristics: Characteristic[];
  public optionalCharacteristics: Characteristic[];

  public exampleCode: string;
  public markdown: string;

  constructor(
    private currentRoute: ActivatedRoute,
    private hapService: HapService,
    private titleService: Title,
    private httpClient: HttpClient,
  ) { }

  ngOnInit(): void {
    this.currentRoute.paramMap.subscribe(params => {
      this.serviceName = params.get('serviceName');
      this.service = this.hapService.getServiceByName(this.serviceName);

      this.requiredCharacteristics = this.service.requiredCharacteristics.map(x => this.hapService.getCharacteristicsByUUID(x));
      this.optionalCharacteristics = this.service.optionalCharacteristics.map(x => this.hapService.getCharacteristicsByUUID(x));

      this.getMarkdown();

      this.titleService.setTitle(`Homebridge API - ${this.serviceName}`);
    });
  }

  getMarkdown() {
    this.markdown = null;
    this.exampleCode = null;
    this.httpClient.get('/docs/service/' + this.serviceName + '.md', {responseType: 'text'}).subscribe(
      (res) => {
        this.markdown = res;
      },
      (err) => {
        this.generateExample();
      },
    );
  }

  generateExample() {
    this.exampleCode = `// Example ${this.service.displayName} Plugin

module.exports = (api) => {
  api.registerAccessory('Example${this.serviceName}Plugin', Example${this.serviceName}Accessory);
};

class Example${this.serviceName}Accessory {

  constructor(log, config, api) {
      this.log = log;
      this.config = config;
      this.api = api;

      this.Service = this.api.hap.Service;
      this.Characteristic = this.api.hap.Characteristic;

      // extract name from config
      this.name = config.name;

      // create a new ${this.service.displayName} service
      this.service = new this.Service(this.Service.${this.serviceName});

      // create handlers for required characteristics
${this.generateRequiredBindings(this.requiredCharacteristics)}
  }

${this.generateMethods(this.requiredCharacteristics)}
}`;
  }

  generateRequiredBindings(characteristics: Characteristic[]): string {
    return characteristics.filter(x => x.props.format !== 'tlv8').map((x) => {
      return `      this.service.getCharacteristic(this.Characteristic.${x.name})
${this.generateGetHandler(x)}${this.generateSetHandler(x)}`;
    }).join('\n');
  }

  generateGetHandler(characteristic: Characteristic): string {
    if (characteristic.props.perms.includes('pr')) {
      const value =  `        .on('get', this.handle${characteristic.name}Get.bind(this))`;
      return characteristic.props.perms.includes('pw') ? value + '\n        ' : value + ';\n';
    } else {
      return `        `;
    }
  }

  generateSetHandler(characteristic: Characteristic): string {
    if (characteristic.props.perms.includes('pw')) {
      return `.on('set', this.handle${characteristic.name}Set.bind(this));\n`;
    } else {
      return ``;
    }
  }

  generateMethods(characteristics: Characteristic[]) {
    return characteristics.filter(x => x.props.format !== 'tlv8').map((x) => {
      return `${this.generateGetMethod(x)}${this.generateSetMethod(x)}`;
    }).join('\n');
  }

  generateGetMethod(characteristic: Characteristic) {
    if (characteristic.props.perms.includes('pr')) {
      return `  /**
   * Handle requests to get the current value of the "${characteristic.displayName}" characteristic
   */
  handle${characteristic.name}Get(callback) {
    this.log.debug('Triggered GET ${characteristic.name}');

    // set this to a valid value for ${characteristic.name}
    const currentValue = 1;

    callback(null, currentValue);
  }\n\n`;
    } else {
      return ``;
    }
  }

  generateSetMethod(characteristic: Characteristic) {
    if (characteristic.props.perms.includes('pw')) {
    return `  /**
   * Handle requests to set the "${characteristic.displayName}" characteristic
   */
  handle${characteristic.name}Set(value, callback) {
    this.log.debug('Triggered SET ${characteristic.name}:' value);

    callback(null);
  }\n`;
    } else {
      return ``;
    }
  }

}
