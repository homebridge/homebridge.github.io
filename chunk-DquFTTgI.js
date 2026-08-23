import{C as Xb,D as ee,H as rv,I as p,L as pv,O as ga,R as py,S as Wt,T as _d,W as zb,_ as Qg,a as AS,b as Rd,f as Gb,i as $b,j as iy,l as Cd,m as Hb,p as HI,r as m,t as yr,u as ES,w as _c,x as Vb,y as Ra}from"./main-LQKQRJBC.js";import{t as l}from"./chunk-DhnX4zpl.js";var D=i=>[`/characteristic`,i];function I(i,c){if(i&1&&(ga(0,`li`)(1,`a`,2),ES(2),_d()()),i&2){let e=c.$implicit;HI(),rv(`routerLink`,AS(2,D,e.name)),HI(),pv(e.displayName)}}function H(i,c){if(i&1&&(ga(0,`li`)(1,`a`,2),ES(2),_d()()),i&2){let e=c.$implicit;HI(),rv(`routerLink`,AS(2,D,e.name)),HI(),pv(e.displayName)}}function G(i,c){if(i&1&&(ga(0,`section`)(1,`h3`),ES(2,`Optional Characteristics`),_d(),ga(3,`ul`),zb(4,H,3,4,`li`,null,$b),_d()()),i&2){let e=Xb(2);HI(4),Gb(e.optionalCharacteristics())}}function U(i,c){if(i&1&&(ga(0,`section`),Ra(1,`markdown`,3),ga(2,`div`,4)(3,`a`,5),ES(4,`Edit on GitHub`),_d()()()),i&2){let e=Xb(2);HI(),rv(`data`,e.markdown()),HI(2),rv(`href`,`https://github.com/homebridge/homebridge.github.io/tree/source/src/docs/service/${e.serviceName()}.md`,Qg)}}function B(i,c){if(i&1&&(ga(0,`section`)(1,`h3`),ES(2,`Example`),_d(),ga(3,`div`,6)(4,`div`,7)(5,`h4`,8)(6,`span`,9),Ra(7,`i`,10),_d(),ES(8,` Note `),_d(),ES(9),_d()(),ga(10,`div`,11),Ra(11,`pre`,12),_d()()),i&2){let e=Xb();HI(9),Rd(` The example below is automatically generated and may not be a complete example of what is required to create a working "`,e.displayName,`" Homebridge plugin. `),HI(2),rv(`appPrism`,c)}}function R(i,c){if(i&1&&(ga(0,`article`,0)(1,`header`,1)(2,`h1`),ES(3),_d(),ga(4,`p`),ES(5),_d()(),ga(6,`section`)(7,`h3`),ES(8,`Required Characteristics`),_d(),ga(9,`ul`),zb(10,I,3,4,`li`,null,$b),_d()(),Vb(12,G,6,0,`section`),Vb(13,U,5,2,`section`),Vb(14,B,12,2,`section`),_d()),i&2){let e,t=c,s=Xb();HI(3),Rd(` `,t.displayName,` `),HI(2),Rd(`UUID: `,t.UUID),HI(5),Gb(s.requiredCharacteristics()),HI(2),Hb(s.optionalCharacteristics().length?12:-1),HI(),Hb(s.markdown()?13:-1),HI(),Hb((e=s.exampleCode())?14:-1,e)}}var Q=(()=>{class i{constructor(){this.currentRoute=p(Wt),this.hapService=p(m),this.titleService=p(py),this.httpClient=p(iy),this.serviceName=ee(``),this.service=ee(void 0),this.requiredCharacteristics=ee([]),this.optionalCharacteristics=ee([]),this.exampleCode=ee(null),this.markdown=ee(null)}ngOnInit(){this.currentRoute.paramMap.subscribe(e=>{this.serviceName.set(e.get(`serviceName`)??``);let t=this.hapService.getServiceByName(this.serviceName());this.service.set(t),t&&(this.requiredCharacteristics.set(t.requiredCharacteristics.map(s=>this.hapService.getCharacteristicsByUUID(s))),this.optionalCharacteristics.set(t.optionalCharacteristics.map(s=>this.hapService.getCharacteristicsByUUID(s))),this.getMarkdown(),this.titleService.setTitle(`Homebridge API - ${this.serviceName()}`))})}getMarkdown(){this.markdown.set(null),this.exampleCode.set(null),this.httpClient.get(`/docs/service/${this.serviceName()}.md`,{responseType:`text`}).subscribe(e=>{this.markdown.set(e)},()=>{this.generateExample()})}generateExample(){let e=this.service();e&&this.exampleCode.set(`// Example ${e.displayName} Plugin

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

      // create a new ${e.displayName} service
      this.service = new this.Service(this.Service.${this.serviceName()});

      // create handlers for required characteristics
${this.generateRequiredBindings(this.requiredCharacteristics())}
  }

${this.generateMethods(this.requiredCharacteristics())}
}`)}generateRequiredBindings(e){return e.filter(t=>t.props.format!==`tlv8`).map(t=>`      this.service.getCharacteristic(this.Characteristic.${t.name})
${this.generateGetHandler(t)}${this.generateSetHandler(t)}`).join(`
`)}generateGetHandler(e){if(e.props.perms.includes(`pr`)){let t=`        .onGet(this.handle${e.name}Get.bind(this))`;return e.props.perms.includes(`pw`)?`${t}
        `:`${t};
`}else return`        `}generateSetHandler(e){return e.props.perms.includes(`pw`)?`.onSet(this.handle${e.name}Set.bind(this));
`:``}generateMethods(e){return e.filter(t=>t.props.format!==`tlv8`).map(t=>`${this.generateGetMethod(t)}${this.generateSetMethod(t)}`).join(`
`)}generateGetMethod(e){return e.props.perms.includes(`pr`)?`  /**
   * Handle requests to get the current value of the "${e.displayName}" characteristic
   */
  handle${e.name}Get() {
    this.log.debug('Triggered GET ${e.name}');

    // set this to a valid value for ${e.name}
    const currentValue = ${e.constValues.length?`this.Characteristic.${e.name}.${e.constValues[0].key}`:e.props?.minValue||`1`};

    return currentValue;
  }

`:``}generateSetMethod(e){return e.props.perms.includes(`pw`)?`  /**
   * Handle requests to set the "${e.displayName}" characteristic
   */
  handle${e.name}Set(value) {
    this.log.debug('Triggered SET ${e.name}:' value);
  }
`:``}static{this.ɵfac=function(t){return new(t||i)}}static{this.ɵcmp=Cd({type:i,selectors:[[`app-service`]],decls:1,vars:1,consts:[[1,`docs-article`],[1,`docs-header`],[3,`routerLink`],[3,`data`],[1,`w-100`,`mt-5`,`text-center`],[3,`href`],[1,`callout-block`,`callout-block-warning`],[1,`content`],[1,`callout-title`],[1,`callout-icon-holder`,`me-1`],[1,`fas`,`fa-circle-info`],[1,`docs-code-block`],[1,`language-js`,3,`appPrism`]],template:function(t,s){if(t&1&&Vb(0,R,15,5,`article`,0),t&2){let $;Hb(($=s.service())?0:-1,$)}},dependencies:[_c,yr,l],encapsulation:2})}}return i})();export{Q as ServiceComponent};