import{A as fS,C as Td,F as lv,I as ly,N as kI,P as kb,R as p,S as Tc,U as ty,W as zb,_ as Nd,b as Pb,g as Na,j as fv,k as ee,l as IS,m as Lb,n as h,p as Jm,s as Fb,t as yr,u as Id,w as Wt,y as Ob,z as pa}from"./main-RR63CE6L.js";import{t as l}from"./chunk-DT7xJDYV.js";var H=()=>[`/api/matter-state`];function R(i,o){i&1&&(pa(0,`section`,4)(1,`h3`),fS(2,`Notes`),Td(),Na(3,`markdown`,5),Td()),i&2&&(kI(3),Jm(`data`,o))}function j(i,o){i&1&&(pa(0,`span`),fS(1,`, `),Td())}function L(i,o){if(i&1&&(pa(0,`span`)(1,`code`),fS(2),Td(),Ob(3,j,2,0,`span`),Td()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;kI(2),lv(e),kI(),kb(l!==s-1?3:-1)}}function B(i,o){i&1&&(pa(0,`span`),fS(1,`, `),Td())}function W(i,o){if(i&1&&(pa(0,`span`)(1,`code`),fS(2),Td(),Ob(3,B,2,0,`span`),Td()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;kI(2),lv(e),kI(),kb(l!==s-1?3:-1)}}function U(i,o){if(i&1&&(pa(0,`p`,13)(1,`strong`),fS(2,`Commands:`),Td(),fS(3,`\xA0 `),Lb(4,W,4,2,`span`,null,Pb),Td()),i&2){let e=zb().$implicit;kI(4),Fb(e.commands)}}function q(i,o){i&1&&(pa(0,`p`,13)(1,`em`),fS(2,`This cluster takes no commands — it only reports state.`),Td()())}function G(i,o){if(i&1&&(pa(0,`div`,7)(1,`h4`)(2,`code`),fS(3),Td()(),pa(4,`p`,13)(5,`strong`),fS(6,`Attributes:`),Td(),fS(7,`\xA0 `),Lb(8,L,4,2,`span`,null,Pb),Td(),Ob(10,U,6,0,`p`,13)(11,q,3,0,`p`,13),Td()),i&2){let e=o.$implicit;kI(3),Nd(`api.matter.clusterNames.`,e.name),kI(5),Fb(e.attributes),kI(2),kb(e.commands.length?10:11)}}function O(i,o){if(i&1&&(pa(0,`section`)(1,`h3`),fS(2,`Clusters`),Td(),pa(3,`p`),fS(4,` The clusters this device type carries. `),pa(5,`strong`),fS(6,`Attributes`),Td(),fS(7,` are the values you push with `),pa(8,`a`,6),fS(9,`updateAccessoryState()`),Td(),fS(10,`, and `),pa(11,`strong`),fS(12,`commands`),Td(),fS(13,` are what a controller sends you, which you answer with a handler. `),Td(),Lb(14,G,12,2,`div`,7,Pb),pa(16,`div`,8)(17,`div`,9)(18,`h4`,10)(19,`span`,11),Na(20,`i`,12),Td(),fS(21,` Note `),Td(),fS(22,` Every endpoint also carries the `),pa(23,`code`),fS(24,`Identify`),Td(),fS(25,`, `),pa(26,`code`),fS(27,`Groups`),Td(),fS(28,`, `),pa(29,`code`),fS(30,`Descriptor`),Td(),fS(31,` and `),pa(32,`code`),fS(33,`ScenesManagement`),Td(),fS(34,` clusters. They are handled by Homebridge and are not usually set by a plugin, so they are not listed here. `),Td()()()),i&2){let e=zb();kI(8),Jm(`routerLink`,IS(1,H)),kI(6),Fb(e.clusters)}}function Q(i,o){if(i&1&&(pa(0,`div`,14)(1,`div`,9)(2,`h4`,10)(3,`span`,11),Na(4,`i`,12),Td(),fS(5,` Note `),Td(),fS(6),Td()()),i&2){let e=zb(2);kI(6),Nd(` The example below is automatically generated and may not be a complete example of what is required to create a working "`,e.name,`" Homebridge plugin. `)}}function z(i,o){if(i&1&&(pa(0,`section`)(1,`h3`),fS(2,`Example`),Td(),Ob(3,Q,7,1,`div`,14),pa(4,`div`,2),Na(5,`pre`,3),Td()()),i&2){let e=zb(2);kI(3),kb(e.exampleIsHandWritten()?-1:3),kI(2),Jm(`appPrism`,o)}}function J(i,o){if(i&1&&(pa(0,`article`,0)(1,`header`,1)(2,`h1`),fS(3),Td(),pa(4,`p`),fS(5),Td()(),pa(6,`section`)(7,`h3`),fS(8,`Usage`),Td(),pa(9,`p`),fS(10,`Pass this device type when registering the accessory:`),Td(),pa(11,`div`,2),Na(12,`pre`,3),Td()(),Ob(13,R,4,1,`section`,4),Ob(14,O,35,2,`section`),Ob(15,z,6,2,`section`),Td()),i&2){let e,l,s=o,m=zb();kI(3),Nd(` `,s.name,` `),kI(2),fv(` Matter device type: `,s.matterName,` (`,s.deviceTypeHex,`) · revision `,s.deviceRevision,` `),kI(7),Jm(`appPrism`,`deviceType: api.matter.deviceTypes.${s.name},`),kI(),kb((e=m.notes())?13:-1,e),kI(),kb(s.clusters.length?14:-1),kI(),kb((l=m.exampleCode())?15:-1,l)}}var oe=(()=>{class i{constructor(){this.currentRoute=p(Wt),this.matterService=p(h),this.titleService=p(ly),this.httpClient=p(ty),this.deviceTypeName=ee(``),this.deviceType=ee(void 0),this.exampleCode=ee(null),this.exampleIsHandWritten=ee(!1),this.notes=ee(null)}ngOnInit(){this.currentRoute.paramMap.subscribe(e=>{this.deviceTypeName.set(e.get(`deviceTypeName`)??``),this.deviceType.set(this.matterService.getDeviceTypeByName(this.deviceTypeName())),this.deviceType()&&(this.getExample(),this.getNotes()),this.titleService.setTitle(`Homebridge API - ${this.deviceTypeName()}`)})}getExample(){this.exampleCode.set(null),this.exampleIsHandWritten.set(!1),this.httpClient.get(`/docs/matter-device-type/examples/${this.deviceTypeName()}.js`,{responseType:`text`}).subscribe({next:e=>{this.exampleCode.set(e),this.exampleIsHandWritten.set(!0)},error:()=>this.generateExample()})}getNotes(){this.notes.set(null),this.httpClient.get(`/docs/matter-device-type/${this.deviceTypeName()}.md`,{responseType:`text`}).subscribe({next:e=>this.notes.set(e),error:()=>this.notes.set(null)})}generateExample(){let e=this.deviceType();if(!e)return;let l=e.clusters,s=l.map(p=>`      ${p.id}: { ${p.exampleAttribute}: undefined }, // set a starting value`).join(`
`),m=l.filter(p=>p.commands.length).map(p=>{let P=p.commands.slice(0,2).map(b=>`        ${b}: async () => {
          // tell your device to ${b}
        },`).join(`
`);return`      ${p.id}: {
${P}
      },`}).join(`
`),T=l[0];this.exampleCode.set(`// Example ${e.name} Matter plugin

module.exports = (api) => {
  api.registerPlatform('Example${e.name}Plugin', Example${e.name}Platform);
};

class Example${e.name}Platform {

  constructor(log, config, api) {
    this.log = log;
    this.api = api;

    api.on('didFinishLaunching', async () => {
      if (!api.isMatterEnabled()) {
        log.info('Matter is not enabled on this bridge');
        return;
      }

      const uuid = api.matter.uuid.generate('example-${e.name.toLowerCase()}');

      await api.matter.registerPlatformAccessories('homebridge-example', 'Example${e.name}Platform', [{
        UUID: uuid,
        displayName: 'Example ${e.name}',
        deviceType: api.matter.deviceTypes.${e.name},
        serialNumber: 'example-${e.name.toLowerCase()}',
        manufacturer: 'Example Co',
        model: '${e.name}',

        // the state a controller sees when the accessory first appears
        clusters: {
${s}
        },
${m?`
        // called when a controller sends a command
        handlers: {
${m}
        },
`:``}      }]);

      this.uuid = uuid;
    });
  }
${T?`
  /**
   * Call this when the device changes outside of Matter - from its own app,
   * a physical button, or a webhook
   */
  async syncFromDevice(value) {
    await this.api.matter.updateAccessoryState(
      this.uuid,
      this.api.matter.clusterNames.${T.name},
      { ${T.exampleAttribute}: value },
    );
  }
`:``}
  /**
   * REQUIRED - called once for every cached Matter accessory at startup
   */
  configureMatterAccessory(accessory) {
    this.log.info('Restoring cached accessory:', accessory.displayName);
  }
}`)}static{this.ɵfac=function(l){return new(l||i)}}static{this.ɵcmp=Id({type:i,selectors:[[`app-matter-device-type`]],decls:1,vars:1,consts:[[1,`docs-article`],[1,`docs-header`],[1,`docs-code-block`],[1,`language-js`,3,`appPrism`],[1,`device-type-notes`],[3,`data`],[`fragment`,`apimatterupdateaccessorystate`,3,`routerLink`],[1,`mb-4`],[1,`callout-block`,`callout-block-info`],[1,`content`],[1,`callout-title`],[1,`callout-icon-holder`,`me-1`],[1,`fas`,`fa-circle-info`],[1,`mb-2`],[1,`callout-block`,`callout-block-warning`]],template:function(l,s){if(l&1&&Ob(0,J,16,8,`article`,0),l&2){let m;kb((m=s.deviceType())?0:-1,m)}},dependencies:[yr,l,Tc],encapsulation:2})}}return i})();export{oe as MatterDeviceTypeComponent};