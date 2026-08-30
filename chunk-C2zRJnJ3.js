import{A as fS,C as Td,F as lv,I as ly,N as kI,P as kb,R as p,S as Tc,U as ty,V as qg,W as zb,_ as Nd,b as Pb,g as Na,i as CS,k as ee,m as Lb,p as Jm,r as m,s as Fb,t as yr,u as Id,w as Wt,y as Ob,z as pa}from"./main-RR63CE6L.js";import{t as l}from"./chunk-DT7xJDYV.js";var D=i=>[`/characteristic`,i];function I(i,c){if(i&1&&(pa(0,`li`)(1,`a`,2),fS(2),Td()()),i&2){let e=c.$implicit;kI(),Jm(`routerLink`,CS(2,D,e.name)),kI(),lv(e.displayName)}}function H(i,c){if(i&1&&(pa(0,`li`)(1,`a`,2),fS(2),Td()()),i&2){let e=c.$implicit;kI(),Jm(`routerLink`,CS(2,D,e.name)),kI(),lv(e.displayName)}}function G(i,c){if(i&1&&(pa(0,`section`)(1,`h3`),fS(2,`Optional Characteristics`),Td(),pa(3,`ul`),Lb(4,H,3,4,`li`,null,Pb),Td()()),i&2){let e=zb(2);kI(4),Fb(e.optionalCharacteristics())}}function U(i,c){if(i&1&&(pa(0,`section`),Na(1,`markdown`,3),pa(2,`div`,4)(3,`a`,5),fS(4,`Edit on GitHub`),Td()()()),i&2){let e=zb(2);kI(),Jm(`data`,e.markdown()),kI(2),Jm(`href`,`https://github.com/homebridge/homebridge.github.io/tree/source/src/docs/service/${e.serviceName()}.md`,qg)}}function B(i,c){if(i&1&&(pa(0,`section`)(1,`h3`),fS(2,`Example`),Td(),pa(3,`div`,6)(4,`div`,7)(5,`h4`,8)(6,`span`,9),Na(7,`i`,10),Td(),fS(8,` Note `),Td(),fS(9),Td()(),pa(10,`div`,11),Na(11,`pre`,12),Td()()),i&2){let e=zb();kI(9),Nd(` The example below is automatically generated and may not be a complete example of what is required to create a working "`,e.displayName,`" Homebridge plugin. `),kI(2),Jm(`appPrism`,c)}}function R(i,c){if(i&1&&(pa(0,`article`,0)(1,`header`,1)(2,`h1`),fS(3),Td(),pa(4,`p`),fS(5),Td()(),pa(6,`section`)(7,`h3`),fS(8,`Required Characteristics`),Td(),pa(9,`ul`),Lb(10,I,3,4,`li`,null,Pb),Td()(),Ob(12,G,6,0,`section`),Ob(13,U,5,2,`section`),Ob(14,B,12,2,`section`),Td()),i&2){let e,t=c,s=zb();kI(3),Nd(` `,t.displayName,` `),kI(2),Nd(`UUID: `,t.UUID),kI(5),Fb(s.requiredCharacteristics()),kI(2),kb(s.optionalCharacteristics().length?12:-1),kI(),kb(s.markdown()?13:-1),kI(),kb((e=s.exampleCode())?14:-1,e)}}var Q=(()=>{class i{constructor(){this.currentRoute=p(Wt),this.hapService=p(m),this.titleService=p(ly),this.httpClient=p(ty),this.serviceName=ee(``),this.service=ee(void 0),this.requiredCharacteristics=ee([]),this.optionalCharacteristics=ee([]),this.exampleCode=ee(null),this.markdown=ee(null)}ngOnInit(){this.currentRoute.paramMap.subscribe(e=>{this.serviceName.set(e.get(`serviceName`)??``);let t=this.hapService.getServiceByName(this.serviceName());this.service.set(t),t&&(this.requiredCharacteristics.set(t.requiredCharacteristics.map(s=>this.hapService.getCharacteristicsByUUID(s))),this.optionalCharacteristics.set(t.optionalCharacteristics.map(s=>this.hapService.getCharacteristicsByUUID(s))),this.getMarkdown(),this.titleService.setTitle(`Homebridge API - ${this.serviceName()}`))})}getMarkdown(){this.markdown.set(null),this.exampleCode.set(null),this.httpClient.get(`/docs/service/${this.serviceName()}.md`,{responseType:`text`}).subscribe(e=>{this.markdown.set(e)},()=>{this.generateExample()})}generateExample(){let e=this.service();e&&this.exampleCode.set(`// Example ${e.displayName} Plugin

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
`:``}static{this.ɵfac=function(t){return new(t||i)}}static{this.ɵcmp=Id({type:i,selectors:[[`app-service`]],decls:1,vars:1,consts:[[1,`docs-article`],[1,`docs-header`],[3,`routerLink`],[3,`data`],[1,`w-100`,`mt-5`,`text-center`],[3,`href`],[1,`callout-block`,`callout-block-warning`],[1,`content`],[1,`callout-title`],[1,`callout-icon-holder`,`me-1`],[1,`fas`,`fa-circle-info`],[1,`docs-code-block`],[1,`language-js`,3,`appPrism`]],template:function(t,s){if(t&1&&Ob(0,R,15,5,`article`,0),t&2){let $;kb(($=s.service())?0:-1,$)}},dependencies:[Tc,yr,l],encapsulation:2})}}return i})();export{Q as ServiceComponent};