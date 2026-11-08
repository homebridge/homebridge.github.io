import{B as te,E as ga,F as qb,H as wS,L as qt,N as p,P as pv,T as fy,U as xS,W as zb,_ as Rd,a as Cv,b as Wb,d as Mc,f as Na,i as $w,l as Gb,m as Od,n as h,o as Cy,t as Fr,u as Hb,v as Sy,w as eS,y as Td}from"./main-GZ74FWWN.js";import{t as l}from"./chunk-BsF29LZK.js";var H=()=>[`/api/matter-state`];function R(i,o){i&1&&(ga(0,`section`,4)(1,`h3`),wS(2,`Notes`),Rd(),Na(3,`markdown`,5),Rd()),i&2&&($w(3),fy(`data`,o))}function j(i,o){i&1&&(ga(0,`span`),wS(1,`, `),Rd())}function L(i,o){if(i&1&&(ga(0,`span`)(1,`code`),wS(2),Rd(),Hb(3,j,2,0,`span`),Rd()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;$w(2),Cy(e),$w(),zb(l!==s-1?3:-1)}}function B(i,o){i&1&&(ga(0,`span`),wS(1,`, `),Rd())}function W(i,o){if(i&1&&(ga(0,`span`)(1,`code`),wS(2),Rd(),Hb(3,B,2,0,`span`),Rd()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;$w(2),Cy(e),$w(),zb(l!==s-1?3:-1)}}function U(i,o){if(i&1&&(ga(0,`p`,13)(1,`strong`),wS(2,`Commands:`),Rd(),wS(3,`\xA0 `),qb(4,W,4,2,`span`,null,Gb),Rd()),i&2){let e=eS().$implicit;$w(4),Wb(e.commands)}}function q(i,o){i&1&&(ga(0,`p`,13)(1,`em`),wS(2,`This cluster takes no commands — it only reports state.`),Rd()())}function G(i,o){if(i&1&&(ga(0,`div`,7)(1,`h4`)(2,`code`),wS(3),Rd()(),ga(4,`p`,13)(5,`strong`),wS(6,`Attributes:`),Rd(),wS(7,`\xA0 `),qb(8,L,4,2,`span`,null,Gb),Rd(),Hb(10,U,6,0,`p`,13)(11,q,3,0,`p`,13),Rd()),i&2){let e=o.$implicit;$w(3),Od(`api.matter.clusterNames.`,e.name),$w(5),Wb(e.attributes),$w(2),zb(e.commands.length?10:11)}}function O(i,o){if(i&1&&(ga(0,`section`)(1,`h3`),wS(2,`Clusters`),Rd(),ga(3,`p`),wS(4,` The clusters this device type carries. `),ga(5,`strong`),wS(6,`Attributes`),Rd(),wS(7,` are the values you push with `),ga(8,`a`,6),wS(9,`updateAccessoryState()`),Rd(),wS(10,`, and `),ga(11,`strong`),wS(12,`commands`),Rd(),wS(13,` are what a controller sends you, which you answer with a handler. `),Rd(),qb(14,G,12,2,`div`,7,Gb),ga(16,`div`,8)(17,`div`,9)(18,`h4`,10)(19,`span`,11),Na(20,`i`,12),Rd(),wS(21,` Note `),Rd(),wS(22,` Every endpoint also carries the `),ga(23,`code`),wS(24,`Identify`),Rd(),wS(25,`, `),ga(26,`code`),wS(27,`Groups`),Rd(),wS(28,`, `),ga(29,`code`),wS(30,`Descriptor`),Rd(),wS(31,` and `),ga(32,`code`),wS(33,`ScenesManagement`),Rd(),wS(34,` clusters. They are handled by Homebridge and are not usually set by a plugin, so they are not listed here. `),Rd()()()),i&2){let e=eS();$w(8),fy(`routerLink`,xS(1,H)),$w(6),Wb(e.clusters)}}function Q(i,o){if(i&1&&(ga(0,`div`,14)(1,`div`,9)(2,`h4`,10)(3,`span`,11),Na(4,`i`,12),Rd(),wS(5,` Note `),Rd(),wS(6),Rd()()),i&2){let e=eS(2);$w(6),Od(` The example below is automatically generated and may not be a complete example of what is required to create a working "`,e.name,`" Homebridge plugin. `)}}function z(i,o){if(i&1&&(ga(0,`section`)(1,`h3`),wS(2,`Example`),Rd(),Hb(3,Q,7,1,`div`,14),ga(4,`div`,2),Na(5,`pre`,3),Rd()()),i&2){let e=eS(2);$w(3),zb(e.exampleIsHandWritten()?-1:3),$w(2),fy(`appPrism`,o)}}function J(i,o){if(i&1&&(ga(0,`article`,0)(1,`header`,1)(2,`h1`),wS(3),Rd(),ga(4,`p`),wS(5),Rd()(),ga(6,`section`)(7,`h3`),wS(8,`Usage`),Rd(),ga(9,`p`),wS(10,`Pass this device type when registering the accessory:`),Rd(),ga(11,`div`,2),Na(12,`pre`,3),Rd()(),Hb(13,R,4,1,`section`,4),Hb(14,O,35,2,`section`),Hb(15,z,6,2,`section`),Rd()),i&2){let e,l,s=o,m=eS();$w(3),Od(` `,s.name,` `),$w(2),Sy(` Matter device type: `,s.matterName,` (`,s.deviceTypeHex,`) · revision `,s.deviceRevision,` `),$w(7),fy(`appPrism`,`deviceType: api.matter.deviceTypes.${s.name},`),$w(),zb((e=m.notes())?13:-1,e),$w(),zb(s.clusters.length?14:-1),$w(),zb((l=m.exampleCode())?15:-1,l)}}var oe=(()=>{class i{constructor(){this.currentRoute=p(qt),this.matterService=p(h),this.titleService=p(Cv),this.httpClient=p(pv),this.deviceTypeName=te(``),this.deviceType=te(void 0),this.exampleCode=te(null),this.exampleIsHandWritten=te(!1),this.notes=te(null)}ngOnInit(){this.currentRoute.paramMap.subscribe(e=>{this.deviceTypeName.set(e.get(`deviceTypeName`)??``),this.deviceType.set(this.matterService.getDeviceTypeByName(this.deviceTypeName())),this.deviceType()&&(this.getExample(),this.getNotes()),this.titleService.setTitle(`Homebridge API - ${this.deviceTypeName()}`)})}getExample(){this.exampleCode.set(null),this.exampleIsHandWritten.set(!1),this.httpClient.get(`/docs/matter-device-type/examples/${this.deviceTypeName()}.js`,{responseType:`text`}).subscribe({next:e=>{this.exampleCode.set(e),this.exampleIsHandWritten.set(!0)},error:()=>this.generateExample()})}getNotes(){this.notes.set(null),this.httpClient.get(`/docs/matter-device-type/${this.deviceTypeName()}.md`,{responseType:`text`}).subscribe({next:e=>this.notes.set(e),error:()=>this.notes.set(null)})}generateExample(){let e=this.deviceType();if(!e)return;let l=e.clusters,s=l.map(p=>`      ${p.id}: { ${p.exampleAttribute}: undefined }, // set a starting value`).join(`
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
}`)}static{this.ɵfac=function(l){return new(l||i)}}static{this.ɵcmp=Td({type:i,selectors:[[`app-matter-device-type`]],decls:1,vars:1,consts:[[1,`docs-article`],[1,`docs-header`],[1,`docs-code-block`],[1,`language-js`,3,`appPrism`],[1,`device-type-notes`],[3,`data`],[`fragment`,`apimatterupdateaccessorystate`,3,`routerLink`],[1,`mb-4`],[1,`callout-block`,`callout-block-info`],[1,`content`],[1,`callout-title`],[1,`callout-icon-holder`,`me-1`],[1,`fas`,`fa-circle-info`],[1,`mb-2`],[1,`callout-block`,`callout-block-warning`]],template:function(l,s){if(l&1&&Hb(0,J,16,8,`article`,0),l&2){let m;zb((m=s.deviceType())?0:-1,m)}},dependencies:[Fr,l,Mc],encapsulation:2})}}return i})();export{oe as MatterDeviceTypeComponent};