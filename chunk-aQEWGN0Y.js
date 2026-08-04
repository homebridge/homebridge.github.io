import{E as ga,H as wd,L as ry,N as nv,O as hv,P as p,R as te,T as fy,V as vS,W as zt,_ as Vb,a as Bb,b as Yg,c as MS,f as Sd,h as Ub,i as Aa,j as jb,l as Md,m as UI,p as Tc,r as m,s as Hb,t as yr,y as Yb}from"./main-43L27H3U.js";import{t as l}from"./chunk-fWthu2b5.js";var D=i=>[`/characteristic`,i];function I(i,c){if(i&1&&(ga(0,`li`)(1,`a`,2),vS(2),Sd()()),i&2){let e=c.$implicit;UI(),nv(`routerLink`,MS(2,D,e.name)),UI(),hv(e.displayName)}}function H(i,c){if(i&1&&(ga(0,`li`)(1,`a`,2),vS(2),Sd()()),i&2){let e=c.$implicit;UI(),nv(`routerLink`,MS(2,D,e.name)),UI(),hv(e.displayName)}}function G(i,c){if(i&1&&(ga(0,`section`)(1,`h3`),vS(2,`Optional Characteristics`),Sd(),ga(3,`ul`),Vb(4,H,3,4,`li`,null,Bb),Sd()()),i&2){let e=Yb(2);UI(4),Hb(e.optionalCharacteristics())}}function U(i,c){if(i&1&&(ga(0,`section`),Aa(1,`markdown`,3),ga(2,`div`,4)(3,`a`,5),vS(4,`Edit on GitHub`),Sd()()()),i&2){let e=Yb(2);UI(),nv(`data`,e.markdown()),UI(2),nv(`href`,`https://github.com/homebridge/homebridge.github.io/tree/source/src/docs/service/${e.serviceName()}.md`,Yg)}}function B(i,c){if(i&1&&(ga(0,`section`)(1,`h3`),vS(2,`Example`),Sd(),ga(3,`div`,6)(4,`div`,7)(5,`h4`,8)(6,`span`,9),Aa(7,`i`,10),Sd(),vS(8,` Note `),Sd(),vS(9),Sd()(),ga(10,`div`,11),Aa(11,`pre`,12),Sd()()),i&2){let e=Yb();UI(9),Md(` The example below is automatically generated and may not be a complete example of what is required to create a working "`,e.displayName,`" Homebridge plugin. `),UI(2),nv(`appPrism`,c)}}function R(i,c){if(i&1&&(ga(0,`article`,0)(1,`header`,1)(2,`h1`),vS(3),Sd(),ga(4,`p`),vS(5),Sd()(),ga(6,`section`)(7,`h3`),vS(8,`Required Characteristics`),Sd(),ga(9,`ul`),Vb(10,I,3,4,`li`,null,Bb),Sd()(),jb(12,G,6,0,`section`),jb(13,U,5,2,`section`),jb(14,B,12,2,`section`),Sd()),i&2){let e,t=c,s=Yb();UI(3),Md(` `,t.displayName,` `),UI(2),Md(`UUID: `,t.UUID),UI(5),Hb(s.requiredCharacteristics()),UI(2),Ub(s.optionalCharacteristics().length?12:-1),UI(),Ub(s.markdown()?13:-1),UI(),Ub((e=s.exampleCode())?14:-1,e)}}var Q=(()=>{class i{constructor(){this.currentRoute=p(zt),this.hapService=p(m),this.titleService=p(fy),this.httpClient=p(ry),this.serviceName=te(``),this.service=te(void 0),this.requiredCharacteristics=te([]),this.optionalCharacteristics=te([]),this.exampleCode=te(null),this.markdown=te(null)}ngOnInit(){this.currentRoute.paramMap.subscribe(e=>{this.serviceName.set(e.get(`serviceName`)??``);let t=this.hapService.getServiceByName(this.serviceName());this.service.set(t),t&&(this.requiredCharacteristics.set(t.requiredCharacteristics.map(s=>this.hapService.getCharacteristicsByUUID(s))),this.optionalCharacteristics.set(t.optionalCharacteristics.map(s=>this.hapService.getCharacteristicsByUUID(s))),this.getMarkdown(),this.titleService.setTitle(`Homebridge API - ${this.serviceName()}`))})}getMarkdown(){this.markdown.set(null),this.exampleCode.set(null),this.httpClient.get(`/docs/service/${this.serviceName()}.md`,{responseType:`text`}).subscribe(e=>{this.markdown.set(e)},()=>{this.generateExample()})}generateExample(){let e=this.service();e&&this.exampleCode.set(`// Example ${e.displayName} Plugin

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
`:``}static{this.ɵfac=function(t){return new(t||i)}}static{this.ɵcmp=wd({type:i,selectors:[[`app-service`]],decls:1,vars:1,consts:[[1,`docs-article`],[1,`docs-header`],[3,`routerLink`],[3,`data`],[1,`w-100`,`mt-5`,`text-center`],[3,`href`],[1,`callout-block`,`callout-block-warning`],[1,`content`],[1,`callout-title`],[1,`callout-icon-holder`,`me-1`],[1,`fas`,`fa-circle-info`],[1,`docs-code-block`],[1,`language-js`,3,`appPrism`]],template:function(t,s){if(t&1&&jb(0,R,15,5,`article`,0),t&2){let $;Ub(($=s.service())?0:-1,$)}},dependencies:[Tc,yr,l],encapsulation:2})}}return i})();export{Q as ServiceComponent};