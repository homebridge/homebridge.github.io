import{D as gv,E as ga,H as wd,L as ry,N as nv,O as hv,P as p,R as te,T as fy,V as vS,W as zt,_ as Vb,a as Bb,f as Sd,h as Ub,i as Aa,j as jb,l as Md,m as UI,n as h,p as Tc,s as Hb,t as yr,x as _S,y as Yb}from"./main-43L27H3U.js";import{t as l}from"./chunk-fWthu2b5.js";var H=()=>[`/api/matter-state`];function R(i,o){i&1&&(ga(0,`section`,4)(1,`h3`),vS(2,`Notes`),Sd(),Aa(3,`markdown`,5),Sd()),i&2&&(UI(3),nv(`data`,o))}function j(i,o){i&1&&(ga(0,`span`),vS(1,`, `),Sd())}function L(i,o){if(i&1&&(ga(0,`span`)(1,`code`),vS(2),Sd(),jb(3,j,2,0,`span`),Sd()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;UI(2),hv(e),UI(),Ub(l!==s-1?3:-1)}}function B(i,o){i&1&&(ga(0,`span`),vS(1,`, `),Sd())}function W(i,o){if(i&1&&(ga(0,`span`)(1,`code`),vS(2),Sd(),jb(3,B,2,0,`span`),Sd()),i&2){let e=o.$implicit,l=o.$index,s=o.$count;UI(2),hv(e),UI(),Ub(l!==s-1?3:-1)}}function U(i,o){if(i&1&&(ga(0,`p`,13)(1,`strong`),vS(2,`Commands:`),Sd(),vS(3,`\xA0 `),Vb(4,W,4,2,`span`,null,Bb),Sd()),i&2){let e=Yb().$implicit;UI(4),Hb(e.commands)}}function q(i,o){i&1&&(ga(0,`p`,13)(1,`em`),vS(2,`This cluster takes no commands — it only reports state.`),Sd()())}function G(i,o){if(i&1&&(ga(0,`div`,7)(1,`h4`)(2,`code`),vS(3),Sd()(),ga(4,`p`,13)(5,`strong`),vS(6,`Attributes:`),Sd(),vS(7,`\xA0 `),Vb(8,L,4,2,`span`,null,Bb),Sd(),jb(10,U,6,0,`p`,13)(11,q,3,0,`p`,13),Sd()),i&2){let e=o.$implicit;UI(3),Md(`api.matter.clusterNames.`,e.name),UI(5),Hb(e.attributes),UI(2),Ub(e.commands.length?10:11)}}function O(i,o){if(i&1&&(ga(0,`section`)(1,`h3`),vS(2,`Clusters`),Sd(),ga(3,`p`),vS(4,` The clusters this device type carries. `),ga(5,`strong`),vS(6,`Attributes`),Sd(),vS(7,` are the values you push with `),ga(8,`a`,6),vS(9,`updateAccessoryState()`),Sd(),vS(10,`, and `),ga(11,`strong`),vS(12,`commands`),Sd(),vS(13,` are what a controller sends you, which you answer with a handler. `),Sd(),Vb(14,G,12,2,`div`,7,Bb),ga(16,`div`,8)(17,`div`,9)(18,`h4`,10)(19,`span`,11),Aa(20,`i`,12),Sd(),vS(21,` Note `),Sd(),vS(22,` Every endpoint also carries the `),ga(23,`code`),vS(24,`Identify`),Sd(),vS(25,`, `),ga(26,`code`),vS(27,`Groups`),Sd(),vS(28,`, `),ga(29,`code`),vS(30,`Descriptor`),Sd(),vS(31,` and `),ga(32,`code`),vS(33,`ScenesManagement`),Sd(),vS(34,` clusters. They are handled by Homebridge and are not usually set by a plugin, so they are not listed here. `),Sd()()()),i&2){let e=Yb();UI(8),nv(`routerLink`,_S(1,H)),UI(6),Hb(e.clusters)}}function Q(i,o){if(i&1&&(ga(0,`div`,14)(1,`div`,9)(2,`h4`,10)(3,`span`,11),Aa(4,`i`,12),Sd(),vS(5,` Note `),Sd(),vS(6),Sd()()),i&2){let e=Yb(2);UI(6),Md(` The example below is automatically generated and may not be a complete example of what is required to create a working "`,e.name,`" Homebridge plugin. `)}}function z(i,o){if(i&1&&(ga(0,`section`)(1,`h3`),vS(2,`Example`),Sd(),jb(3,Q,7,1,`div`,14),ga(4,`div`,2),Aa(5,`pre`,3),Sd()()),i&2){let e=Yb(2);UI(3),Ub(e.exampleIsHandWritten()?-1:3),UI(2),nv(`appPrism`,o)}}function J(i,o){if(i&1&&(ga(0,`article`,0)(1,`header`,1)(2,`h1`),vS(3),Sd(),ga(4,`p`),vS(5),Sd()(),ga(6,`section`)(7,`h3`),vS(8,`Usage`),Sd(),ga(9,`p`),vS(10,`Pass this device type when registering the accessory:`),Sd(),ga(11,`div`,2),Aa(12,`pre`,3),Sd()(),jb(13,R,4,1,`section`,4),jb(14,O,35,2,`section`),jb(15,z,6,2,`section`),Sd()),i&2){let e,l,s=o,m=Yb();UI(3),Md(` `,s.name,` `),UI(2),gv(` Matter device type: `,s.matterName,` (`,s.deviceTypeHex,`) · revision `,s.deviceRevision,` `),UI(7),nv(`appPrism`,`deviceType: api.matter.deviceTypes.${s.name},`),UI(),Ub((e=m.notes())?13:-1,e),UI(),Ub(s.clusters.length?14:-1),UI(),Ub((l=m.exampleCode())?15:-1,l)}}var oe=(()=>{class i{constructor(){this.currentRoute=p(zt),this.matterService=p(h),this.titleService=p(fy),this.httpClient=p(ry),this.deviceTypeName=te(``),this.deviceType=te(void 0),this.exampleCode=te(null),this.exampleIsHandWritten=te(!1),this.notes=te(null)}ngOnInit(){this.currentRoute.paramMap.subscribe(e=>{this.deviceTypeName.set(e.get(`deviceTypeName`)??``),this.deviceType.set(this.matterService.getDeviceTypeByName(this.deviceTypeName())),this.deviceType()&&(this.getExample(),this.getNotes()),this.titleService.setTitle(`Homebridge API - ${this.deviceTypeName()}`)})}getExample(){this.exampleCode.set(null),this.exampleIsHandWritten.set(!1),this.httpClient.get(`/docs/matter-device-type/examples/${this.deviceTypeName()}.js`,{responseType:`text`}).subscribe({next:e=>{this.exampleCode.set(e),this.exampleIsHandWritten.set(!0)},error:()=>this.generateExample()})}getNotes(){this.notes.set(null),this.httpClient.get(`/docs/matter-device-type/${this.deviceTypeName()}.md`,{responseType:`text`}).subscribe({next:e=>this.notes.set(e),error:()=>this.notes.set(null)})}generateExample(){let e=this.deviceType();if(!e)return;let l=e.clusters,s=l.map(p=>`      ${p.id}: { ${p.exampleAttribute}: undefined }, // set a starting value`).join(`
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
}`)}static{this.ɵfac=function(l){return new(l||i)}}static{this.ɵcmp=wd({type:i,selectors:[[`app-matter-device-type`]],decls:1,vars:1,consts:[[1,`docs-article`],[1,`docs-header`],[1,`docs-code-block`],[1,`language-js`,3,`appPrism`],[1,`device-type-notes`],[3,`data`],[`fragment`,`apimatterupdateaccessorystate`,3,`routerLink`],[1,`mb-4`],[1,`callout-block`,`callout-block-info`],[1,`content`],[1,`callout-title`],[1,`callout-icon-holder`,`me-1`],[1,`fas`,`fa-circle-info`],[1,`mb-2`],[1,`callout-block`,`callout-block-warning`]],template:function(l,s){if(l&1&&jb(0,J,16,8,`article`,0),l&2){let m;Ub((m=s.deviceType())?0:-1,m)}},dependencies:[yr,l,Tc],encapsulation:2})}}return i})();export{oe as MatterDeviceTypeComponent};