# Plugin Config Screen

Every plugin installed through the Homebridge UI has a settings screen, reached from the plugin's **Settings** button. What that screen looks like depends on what your plugin ships:

| Level          | What you publish                                          | What the user sees                                                                                       |
| -------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| None           | Nothing extra                                             | The raw JSON config editor. Users must edit your plugin's config block by hand.                          |
| Generated form | A [`config.schema.json`](/#/config-screen/schema) file    | A settings form generated from your schema — inputs, dropdowns, validation, help text. No code required. |
| Custom UI      | A [`homebridge-ui`](/#/config-screen/custom-ui) directory | A fully custom HTML/CSS/JavaScript interface, with an optional server-side script.                       |

## The Generated Form

For most plugins, a `config.schema.json` file is all you need. Publish it in the root of your npm package and the Homebridge UI will detect it and show the **Settings** button on your plugin's page:

![image](https://user-images.githubusercontent.com/3979615/58320524-29cffc00-7e5f-11e9-94e1-114cd77c18c4.png)

Users then configure your plugin through a form instead of editing the Homebridge `config.json` by hand. Both **platform** and **accessory** plugin types are supported.

See [Config Schema](/#/config-screen/schema) for the file format, and [Schema Examples](/#/config-screen/schema-examples) for complete real-world schemas.

## Custom User Interfaces

If your plugin has requirements the generated form cannot express — an OAuth2 workflow, exchanging a username and password for a token, discovering devices to pair — you can replace the form with a fully custom user interface using the [@homebridge/plugin-ui-utils](https://github.com/homebridge/plugin-ui-utils) package.

See [Custom User Interfaces](/#/config-screen/custom-ui) for the API, and [Custom UI Examples](/#/config-screen/custom-ui-examples) for working examples and plugins to learn from.

## Which Should I Use?

- Start with a `config.schema.json`. It covers most plugins, needs no code, and users get validation for free.
- Move to a custom UI only when the form genuinely cannot do what you need. A custom UI is more work to build and maintain, and you become responsible for updating the config yourself.
- The two are not exclusive: a custom UI can [render your schema-generated form](/#/config-screen/custom-ui#homebridgeshowschemaform) inside itself, or build its own forms from a schema.
