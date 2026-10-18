import{D as fv,I as qt,O as ga,S as Ub,W as zb,a as Bw,b as Rd,d as Iy,f as Kb,g as Od,h as Na,i as $b,j as ly,k as h,l as Hb,m as NS,n as h$1,o as Cy,p as Mc,s as DS,t as Mr,u as Iv,w as Vb,x as Td,z as te}from"./main-76IGBAX4.js";import{t as l}from"./chunk-DR4enKM0.js";var H=()=>[`/api/matter-state`];function R(i,o){i&1&&(ga(0,`section`,4)(1,`h3`),DS(2,`Notes`),Rd(),Na(3,`markdown`,5),Rd()),i&2&&(Bw(3),ly(`data`,o))}function j(i,o){i&1&&(ga(0,`span`),DS(1,`, `),Rd())}function L(i,o){if(i&1&&(ga(0,`span`)(1,`code`),DS(2),Rd(),Ub(3,j,2,0,`span`),Rd()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;Bw(2),Iy(e),Bw(),Vb(l!==s-1?3:-1)}}function B(i,o){i&1&&(ga(0,`span`),DS(1,`, `),Rd())}function W(i,o){if(i&1&&(ga(0,`span`)(1,`code`),DS(2),Rd(),Ub(3,B,2,0,`span`),Rd()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;Bw(2),Iy(e),Bw(),Vb(l!==s-1?3:-1)}}function U(i,o){if(i&1&&(ga(0,`p`,13)(1,`strong`),DS(2,`Commands:`),Rd(),DS(3,`\xA0 `),$b(4,W,4,2,`span`,null,Hb),Rd()),i&2){let e=Kb().$implicit;Bw(4),zb(e.commands)}}function q(i,o){i&1&&(ga(0,`p`,13)(1,`em`),DS(2,`This cluster takes no commands — it only reports state.`),Rd()())}function G(i,o){if(i&1&&(ga(0,`div`,7)(1,`h4`)(2,`code`),DS(3),Rd()(),ga(4,`p`,13)(5,`strong`),DS(6,`Attributes:`),Rd(),DS(7,`\xA0 `),$b(8,L,4,2,`span`,null,Hb),Rd(),Ub(10,U,6,0,`p`,13)(11,q,3,0,`p`,13),Rd()),i&2){let e=o.$implicit;Bw(3),Od(`api.matter.clusterNames.`,e.name),Bw(5),zb(e.attributes),Bw(2),Vb(e.commands.length?10:11)}}function O(i,o){if(i&1&&(ga(0,`section`)(1,`h3`),DS(2,`Clusters`),Rd(),ga(3,`p`),DS(4,` The clusters this device type carries. `),ga(5,`strong`),DS(6,`Attributes`),Rd(),DS(7,` are the values you push with `),ga(8,`a`,6),DS(9,`updateAccessoryState()`),Rd(),DS(10,`, and `),ga(11,`strong`),DS(12,`commands`),Rd(),DS(13,` are what a controller sends you, which you answer with a handler. `),Rd(),$b(14,G,12,2,`div`,7,Hb),ga(16,`div`,8)(17,`div`,9)(18,`h4`,10)(19,`span`,11),Na(20,`i`,12),Rd(),DS(21,` Note `),Rd(),DS(22,` Every endpoint also carries the `),ga(23,`code`),DS(24,`Identify`),Rd(),DS(25,`, `),ga(26,`code`),DS(27,`Groups`),Rd(),DS(28,`, `),ga(29,`code`),DS(30,`Descriptor`),Rd(),DS(31,` and `),ga(32,`code`),DS(33,`ScenesManagement`),Rd(),DS(34,` clusters. They are handled by Homebridge and are not usually set by a plugin, so they are not listed here. `),Rd()()()),i&2){let e=Kb();Bw(8),ly(`routerLink`,NS(1,H)),Bw(6),zb(e.clusters)}}function Q(i,o){if(i&1&&(ga(0,`div`,14)(1,`div`,9)(2,`h4`,10)(3,`span`,11),Na(4,`i`,12),Rd(),DS(5,` Note `),Rd(),DS(6),Rd()()),i&2){let e=Kb(2);Bw(6),Od(` The example below is automatically generated and may not be a complete example of what is required to create a working "`,e.name,`" Homebridge plugin. `)}}function z(i,o){if(i&1&&(ga(0,`section`)(1,`h3`),DS(2,`Example`),Rd(),Ub(3,Q,7,1,`div`,14),ga(4,`div`,2),Na(5,`pre`,3),Rd()()),i&2){let e=Kb(2);Bw(3),Vb(e.exampleIsHandWritten()?-1:3),Bw(2),ly(`appPrism`,o)}}function J(i,o){if(i&1&&(ga(0,`article`,0)(1,`header`,1)(2,`h1`),DS(3),Rd(),ga(4,`p`),DS(5),Rd()(),ga(6,`section`)(7,`h3`),DS(8,`Usage`),Rd(),ga(9,`p`),DS(10,`Pass this device type when registering the accessory:`),Rd(),ga(11,`div`,2),Na(12,`pre`,3),Rd()(),Ub(13,R,4,1,`section`,4),Ub(14,O,35,2,`section`),Ub(15,z,6,2,`section`),Rd()),i&2){let e,l,s=o,m=Kb();Bw(3),Od(` `,s.name,` `),Bw(2),Cy(` Matter device type: `,s.matterName,` (`,s.deviceTypeHex,`) · revision `,s.deviceRevision,` `),Bw(7),ly(`appPrism`,`deviceType: api.matter.deviceTypes.${s.name},`),Bw(),Vb((e=m.notes())?13:-1,e),Bw(),Vb(s.clusters.length?14:-1),Bw(),Vb((l=m.exampleCode())?15:-1,l)}}var oe=(()=>{class i{constructor(){this.currentRoute=h(qt),this.matterService=h(h$1),this.titleService=h(Iv),this.httpClient=h(fv),this.deviceTypeName=te(``),this.deviceType=te(void 0),this.exampleCode=te(null),this.exampleIsHandWritten=te(!1),this.notes=te(null)}ngOnInit(){this.currentRoute.paramMap.subscribe(e=>{this.deviceTypeName.set(e.get(`deviceTypeName`)??``),this.deviceType.set(this.matterService.getDeviceTypeByName(this.deviceTypeName())),this.deviceType()&&(this.getExample(),this.getNotes()),this.titleService.setTitle(`Homebridge API - ${this.deviceTypeName()}`)})}getExample(){this.exampleCode.set(null),this.exampleIsHandWritten.set(!1),this.httpClient.get(`/docs/matter-device-type/examples/${this.deviceTypeName()}.js`,{responseType:`text`}).subscribe({next:e=>{this.exampleCode.set(e),this.exampleIsHandWritten.set(!0)},error:()=>this.generateExample()})}getNotes(){this.notes.set(null),this.httpClient.get(`/docs/matter-device-type/${this.deviceTypeName()}.md`,{responseType:`text`}).subscribe({next:e=>this.notes.set(e),error:()=>this.notes.set(null)})}generateExample(){let e=this.deviceType();if(!e)return;let l=e.clusters,s=l.map(p=>`      ${p.id}: { ${p.exampleAttribute}: undefined }, // set a starting value`).join(`
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
}`)}static{this.ɵfac=function(l){return new(l||i)}}static{this.ɵcmp=Td({type:i,selectors:[[`app-matter-device-type`]],decls:1,vars:1,consts:[[1,`docs-article`],[1,`docs-header`],[1,`docs-code-block`],[1,`language-js`,3,`appPrism`],[1,`device-type-notes`],[3,`data`],[`fragment`,`apimatterupdateaccessorystate`,3,`routerLink`],[1,`mb-4`],[1,`callout-block`,`callout-block-info`],[1,`content`],[1,`callout-title`],[1,`callout-icon-holder`,`me-1`],[1,`fas`,`fa-circle-info`],[1,`mb-2`],[1,`callout-block`,`callout-block-warning`]],template:function(l,s){if(l&1&&Ub(0,J,16,8,`article`,0),l&2){let m;Vb((m=s.deviceType())?0:-1,m)}},dependencies:[Mr,l,Mc],encapsulation:2})}}return i})();export{oe as MatterDeviceTypeComponent};