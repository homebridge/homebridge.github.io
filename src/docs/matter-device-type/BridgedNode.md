Not a device in its own right — a container for an accessory made of several endpoints.

Use it as the parent when an accessory has [parts](api/matter-platform-methods#composed-accessories): a power strip whose sockets switch independently, a remote with several buttons, or a sensor unit that reports more than one thing.

The children appear in Apple Home as a **single accessory that expands into separate tiles**, rather than as unrelated accessories that happen to share a name.

```js
const accessory = {
  UUID: uuid,
  displayName: 'Power Strip',
  deviceType: api.matter.deviceTypes.BridgedNode,
  parts: [
    { id: 'outlet-1', displayName: 'Outlet 1', deviceType: api.matter.deviceTypes.OnOffOutlet },
    { id: 'outlet-2', displayName: 'Outlet 2', deviceType: api.matter.deviceTypes.OnOffOutlet },
  ],
}
```

A part's `id` is what you pass as `partId` to [updateAccessoryState()](api/matter-state#apimatterupdateaccessorystate) and `getAccessoryState()` to address that part rather than the accessory as a whole.
