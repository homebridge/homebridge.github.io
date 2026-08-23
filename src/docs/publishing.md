# Publishing Your Plugin

A Homebridge plugin is an ordinary npm package, so publishing is `npm publish`. What follows covers the parts that are specific to Homebridge: getting listed, getting verified, and letting users support your work.

## Getting listed

The Homebridge UI finds plugins through npm's search index, looking for the `homebridge-plugin` keyword. A newly published plugin appears once npm has indexed it, not instantly.

Two things to check before the first release:

- **What ends up in the tarball.** Set the `files` field in `package.json` (or use `.npmignore`) so tests, sources and maps are not shipped to users. `npm pack --dry-run` lists exactly what would be published.
- **A [config schema](/#/config-screen/schema).** Without one, users have to edit `config.json` by hand; with one, the UI generates a settings form.

Also declare your [transport keywords](/#/#declaring-supported-transports) so the UI knows whether your plugin publishes over HAP, Matter or both.

## Verified By Homebridge

Verification is a review by the Homebridge team. A verified plugin is marked in the Homebridge UI, ranks higher in search, and becomes eligible for [donation links](#donation-links).

It is worth building to the criteria whether or not you apply, because they encode what makes a plugin behave well on other people's systems. In summary, a plugin must:

- Be a [dynamic platform](api/platform-plugins), and offer more than an existing verified plugin already does
- Be published to npm, with source on GitHub and issues enabled, and a GitHub release with notes for each version
- Run on all supported LTS versions of Node.js
- Install successfully and **not start until it is configured**
- Not run post-install scripts that modify the user's system
- Not require a TTY or non-standard startup parameters, even for first-time setup
- Implement a [config schema](/#/config-screen/schema) for the settings GUI
- Contain no analytics or user tracking
- Write any files it needs inside the Homebridge storage directory — see [API.user.storagePath](api/reference#apiuserstoragepath)
- Catch and log its own errors rather than throwing unhandled exceptions

The criteria are reviewed over time, so check the [Verified By Homebridge](https://github.com/homebridge/plugins) repository for the current list and for how to submit your plugin.

## Scoped plugins

Some plugins are published under the `@homebridge-plugins/` npm scope — for example `@homebridge-plugins/homebridge-example` rather than `homebridge-example`.

This exists to solve a real problem: when a maintainer disappears, a plugin gets forked several times over and users cannot tell which fork to install. A scoped plugin lives in the Homebridge Plugins GitHub organisation, and while its original maintainer continues to run it, the Homebridge team can hand maintenance on if they become unavailable. Every scoped plugin also meets the verification criteria.

Only a Homebridge collaborator can publish the first release under the scope, so this is not something to set up yourself — it is arranged with the Homebridge team. See [Scoped Plugins](https://github.com/homebridge/plugins/wiki/Scoped-Plugins) for the full explanation and the list of plugins that have moved.

## Donation links

A verified plugin can show a **Donate** button on its tile in the Homebridge UI. This matters because users increasingly install plugins from the UI and never see the GitHub page where support links usually live.

It uses npm's standard `funding` field in `package.json`:

```json
{
  "funding": {
    "type": "github",
    "url": "https://github.com/sponsors/my-account"
  }
}
```

Several options can be offered at once:

```json
{
  "funding": [
    {
      "type": "github",
      "url": "https://github.com/sponsors/my-account"
    },
    {
      "type": "patreon",
      "url": "https://www.patreon.com/my-account"
    }
  ]
}
```

The `type` picks the icon shown: `github` for GitHub Sponsors, `paypal`, `patreon`, and `kofi` or `ko-fi` for Ko-fi. Anything else gets a generic link icon.

The button only appears for plugins that are published to npm and [verified](#verified-by-homebridge).
