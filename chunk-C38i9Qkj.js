import{A as nm,B as te,E as ga,F as qb,H as wS,L as qt,N as p,P as pv,T as fy,W as zb,_ as Rd,a as Cv,b as Wb,d as Mc,f as Na,i as $w,l as Gb,m as Od,o as Cy,p as OS,r as m,t as Mr,u as Hb,w as eS,y as Td}from"./main-T6G5L2EG.js";import{t as l}from"./chunk-CfSnb5jC.js";var D=i=>[`/characteristic`,i];function I(i,c){if(i&1&&(ga(0,`li`)(1,`a`,2),wS(2),Rd()()),i&2){let e=c.$implicit;$w(),fy(`routerLink`,OS(2,D,e.name)),$w(),Cy(e.displayName)}}function H(i,c){if(i&1&&(ga(0,`li`)(1,`a`,2),wS(2),Rd()()),i&2){let e=c.$implicit;$w(),fy(`routerLink`,OS(2,D,e.name)),$w(),Cy(e.displayName)}}function G(i,c){if(i&1&&(ga(0,`section`)(1,`h3`),wS(2,`Optional Characteristics`),Rd(),ga(3,`ul`),qb(4,H,3,4,`li`,null,Gb),Rd()()),i&2){let e=eS(2);$w(4),Wb(e.optionalCharacteristics())}}function U(i,c){if(i&1&&(ga(0,`section`),Na(1,`markdown`,3),ga(2,`div`,4)(3,`a`,5),wS(4,`Edit on GitHub`),Rd()()()),i&2){let e=eS(2);$w(),fy(`data`,e.markdown()),$w(2),fy(`href`,`https://github.com/homebridge/homebridge.github.io/tree/source/src/docs/service/${e.serviceName()}.md`,nm)}}function B(i,c){if(i&1&&(ga(0,`section`)(1,`h3`),wS(2,`Example`),Rd(),ga(3,`div`,6)(4,`div`,7)(5,`h4`,8)(6,`span`,9),Na(7,`i`,10),Rd(),wS(8,` Note `),Rd(),wS(9),Rd()(),ga(10,`div`,11),Na(11,`pre`,12),Rd()()),i&2){let e=eS();$w(9),Od(` The example below is automatically generated and may not be a complete example of what is required to create a working "`,e.displayName,`" Homebridge plugin. `),$w(2),fy(`appPrism`,c)}}function R(i,c){if(i&1&&(ga(0,`article`,0)(1,`header`,1)(2,`h1`),wS(3),Rd(),ga(4,`p`),wS(5),Rd()(),ga(6,`section`)(7,`h3`),wS(8,`Required Characteristics`),Rd(),ga(9,`ul`),qb(10,I,3,4,`li`,null,Gb),Rd()(),Hb(12,G,6,0,`section`),Hb(13,U,5,2,`section`),Hb(14,B,12,2,`section`),Rd()),i&2){let e,t=c,s=eS();$w(3),Od(` `,t.displayName,` `),$w(2),Od(`UUID: `,t.UUID),$w(5),Wb(s.requiredCharacteristics()),$w(2),zb(s.optionalCharacteristics().length?12:-1),$w(),zb(s.markdown()?13:-1),$w(),zb((e=s.exampleCode())?14:-1,e)}}var Q=(()=>{class i{constructor(){this.currentRoute=p(qt),this.hapService=p(m),this.titleService=p(Cv),this.httpClient=p(pv),this.serviceName=te(``),this.service=te(void 0),this.requiredCharacteristics=te([]),this.optionalCharacteristics=te([]),this.exampleCode=te(null),this.markdown=te(null)}ngOnInit(){this.currentRoute.paramMap.subscribe(e=>{this.serviceName.set(e.get(`serviceName`)??``);let t=this.hapService.getServiceByName(this.serviceName());this.service.set(t),t&&(this.requiredCharacteristics.set(t.requiredCharacteristics.map(s=>this.hapService.getCharacteristicsByUUID(s))),this.optionalCharacteristics.set(t.optionalCharacteristics.map(s=>this.hapService.getCharacteristicsByUUID(s))),this.getMarkdown(),this.titleService.setTitle(`Homebridge API - ${this.serviceName()}`))})}getMarkdown(){this.markdown.set(null),this.exampleCode.set(null),this.httpClient.get(`/docs/service/${this.serviceName()}.md`,{responseType:`text`}).subscribe(e=>{this.markdown.set(e)},()=>{this.generateExample()})}generateExample(){let e=this.service();e&&this.exampleCode.set(`// Example ${e.displayName} Plugin

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
`:``}static{this.ɵfac=function(t){return new(t||i)}}static{this.ɵcmp=Td({type:i,selectors:[[`app-service`]],decls:1,vars:1,consts:[[1,`docs-article`],[1,`docs-header`],[3,`routerLink`],[3,`data`],[1,`w-100`,`mt-5`,`text-center`],[3,`href`],[1,`callout-block`,`callout-block-warning`],[1,`content`],[1,`callout-title`],[1,`callout-icon-holder`,`me-1`],[1,`fas`,`fa-circle-info`],[1,`docs-code-block`],[1,`language-js`,3,`appPrism`]],template:function(t,s){if(t&1&&Hb(0,R,15,5,`article`,0),t&2){let $;zb(($=s.service())?0:-1,$)}},dependencies:[Mc,Mr,l],encapsulation:2})}}return i})();export{Q as ServiceComponent};