import{C as Xb,D as ee,H as rv,I as p,L as pv,N as mv,O as ga,R as py,S as Wt,T as _d,W as zb,b as Rd,f as Gb,i as $b,j as iy,l as Cd,m as Hb,n as h,p as HI,t as yr,u as ES,v as RS,w as _c,x as Vb,y as Ra}from"./main-MAOMJENV.js";import{t as l}from"./chunk-DMseDADY.js";var H=()=>[`/api/matter-state`];function R(i,o){i&1&&(ga(0,`section`,4)(1,`h3`),ES(2,`Notes`),_d(),Ra(3,`markdown`,5),_d()),i&2&&(HI(3),rv(`data`,o))}function j(i,o){i&1&&(ga(0,`span`),ES(1,`, `),_d())}function L(i,o){if(i&1&&(ga(0,`span`)(1,`code`),ES(2),_d(),Vb(3,j,2,0,`span`),_d()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;HI(2),pv(e),HI(),Hb(l!==s-1?3:-1)}}function B(i,o){i&1&&(ga(0,`span`),ES(1,`, `),_d())}function W(i,o){if(i&1&&(ga(0,`span`)(1,`code`),ES(2),_d(),Vb(3,B,2,0,`span`),_d()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;HI(2),pv(e),HI(),Hb(l!==s-1?3:-1)}}function U(i,o){if(i&1&&(ga(0,`p`,13)(1,`strong`),ES(2,`Commands:`),_d(),ES(3,`\xA0 `),zb(4,W,4,2,`span`,null,$b),_d()),i&2){let e=Xb().$implicit;HI(4),Gb(e.commands)}}function q(i,o){i&1&&(ga(0,`p`,13)(1,`em`),ES(2,`This cluster takes no commands — it only reports state.`),_d()())}function G(i,o){if(i&1&&(ga(0,`div`,7)(1,`h4`)(2,`code`),ES(3),_d()(),ga(4,`p`,13)(5,`strong`),ES(6,`Attributes:`),_d(),ES(7,`\xA0 `),zb(8,L,4,2,`span`,null,$b),_d(),Vb(10,U,6,0,`p`,13)(11,q,3,0,`p`,13),_d()),i&2){let e=o.$implicit;HI(3),Rd(`api.matter.clusterNames.`,e.name),HI(5),Gb(e.attributes),HI(2),Hb(e.commands.length?10:11)}}function O(i,o){if(i&1&&(ga(0,`section`)(1,`h3`),ES(2,`Clusters`),_d(),ga(3,`p`),ES(4,` The clusters this device type carries. `),ga(5,`strong`),ES(6,`Attributes`),_d(),ES(7,` are the values you push with `),ga(8,`a`,6),ES(9,`updateAccessoryState()`),_d(),ES(10,`, and `),ga(11,`strong`),ES(12,`commands`),_d(),ES(13,` are what a controller sends you, which you answer with a handler. `),_d(),zb(14,G,12,2,`div`,7,$b),ga(16,`div`,8)(17,`div`,9)(18,`h4`,10)(19,`span`,11),Ra(20,`i`,12),_d(),ES(21,` Note `),_d(),ES(22,` Every endpoint also carries the `),ga(23,`code`),ES(24,`Identify`),_d(),ES(25,`, `),ga(26,`code`),ES(27,`Groups`),_d(),ES(28,`, `),ga(29,`code`),ES(30,`Descriptor`),_d(),ES(31,` and `),ga(32,`code`),ES(33,`ScenesManagement`),_d(),ES(34,` clusters. They are handled by Homebridge and are not usually set by a plugin, so they are not listed here. `),_d()()()),i&2){let e=Xb();HI(8),rv(`routerLink`,RS(1,H)),HI(6),Gb(e.clusters)}}function Q(i,o){if(i&1&&(ga(0,`div`,14)(1,`div`,9)(2,`h4`,10)(3,`span`,11),Ra(4,`i`,12),_d(),ES(5,` Note `),_d(),ES(6),_d()()),i&2){let e=Xb(2);HI(6),Rd(` The example below is automatically generated and may not be a complete example of what is required to create a working "`,e.name,`" Homebridge plugin. `)}}function z(i,o){if(i&1&&(ga(0,`section`)(1,`h3`),ES(2,`Example`),_d(),Vb(3,Q,7,1,`div`,14),ga(4,`div`,2),Ra(5,`pre`,3),_d()()),i&2){let e=Xb(2);HI(3),Hb(e.exampleIsHandWritten()?-1:3),HI(2),rv(`appPrism`,o)}}function J(i,o){if(i&1&&(ga(0,`article`,0)(1,`header`,1)(2,`h1`),ES(3),_d(),ga(4,`p`),ES(5),_d()(),ga(6,`section`)(7,`h3`),ES(8,`Usage`),_d(),ga(9,`p`),ES(10,`Pass this device type when registering the accessory:`),_d(),ga(11,`div`,2),Ra(12,`pre`,3),_d()(),Vb(13,R,4,1,`section`,4),Vb(14,O,35,2,`section`),Vb(15,z,6,2,`section`),_d()),i&2){let e,l,s=o,m=Xb();HI(3),Rd(` `,s.name,` `),HI(2),mv(` Matter device type: `,s.matterName,` (`,s.deviceTypeHex,`) · revision `,s.deviceRevision,` `),HI(7),rv(`appPrism`,`deviceType: api.matter.deviceTypes.${s.name},`),HI(),Hb((e=m.notes())?13:-1,e),HI(),Hb(s.clusters.length?14:-1),HI(),Hb((l=m.exampleCode())?15:-1,l)}}var oe=(()=>{class i{constructor(){this.currentRoute=p(Wt),this.matterService=p(h),this.titleService=p(py),this.httpClient=p(iy),this.deviceTypeName=ee(``),this.deviceType=ee(void 0),this.exampleCode=ee(null),this.exampleIsHandWritten=ee(!1),this.notes=ee(null)}ngOnInit(){this.currentRoute.paramMap.subscribe(e=>{this.deviceTypeName.set(e.get(`deviceTypeName`)??``),this.deviceType.set(this.matterService.getDeviceTypeByName(this.deviceTypeName())),this.deviceType()&&(this.getExample(),this.getNotes()),this.titleService.setTitle(`Homebridge API - ${this.deviceTypeName()}`)})}getExample(){this.exampleCode.set(null),this.exampleIsHandWritten.set(!1),this.httpClient.get(`/docs/matter-device-type/examples/${this.deviceTypeName()}.js`,{responseType:`text`}).subscribe({next:e=>{this.exampleCode.set(e),this.exampleIsHandWritten.set(!0)},error:()=>this.generateExample()})}getNotes(){this.notes.set(null),this.httpClient.get(`/docs/matter-device-type/${this.deviceTypeName()}.md`,{responseType:`text`}).subscribe({next:e=>this.notes.set(e),error:()=>this.notes.set(null)})}generateExample(){let e=this.deviceType();if(!e)return;let l=e.clusters,s=l.map(p=>`      ${p.id}: { ${p.exampleAttribute}: undefined }, // set a starting value`).join(`
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
}`)}static{this.ɵfac=function(l){return new(l||i)}}static{this.ɵcmp=Cd({type:i,selectors:[[`app-matter-device-type`]],decls:1,vars:1,consts:[[1,`docs-article`],[1,`docs-header`],[1,`docs-code-block`],[1,`language-js`,3,`appPrism`],[1,`device-type-notes`],[3,`data`],[`fragment`,`apimatterupdateaccessorystate`,3,`routerLink`],[1,`mb-4`],[1,`callout-block`,`callout-block-info`],[1,`content`],[1,`callout-title`],[1,`callout-icon-holder`,`me-1`],[1,`fas`,`fa-circle-info`],[1,`mb-2`],[1,`callout-block`,`callout-block-warning`]],template:function(l,s){if(l&1&&Vb(0,J,16,8,`article`,0),l&2){let m;Hb((m=s.deviceType())?0:-1,m)}},dependencies:[yr,l,_c],encapsulation:2})}}return i})();export{oe as MatterDeviceTypeComponent};