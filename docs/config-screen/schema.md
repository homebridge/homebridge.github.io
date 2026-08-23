# Config Schema

By adding a config schema to your plugin, users will be able to configure your plugin in the Homebridge UI without having to manually edit the Homebridge `config.json` file.

Plugin authors should publish a `config.schema.json` file in the root of their npm package which defines the config their plugin requires, in the JSON Schema format (v6, v4 or v3). See the [Plugin Config Screen overview](/#/config-screen/overview) for how this fits into the wider settings experience.

- [Form Generator Playground](#form-generator-playground)
- [Basic Structure](#basic-structure)
- [Default Values](#default-values)
- [Placeholder Values](#placeholder-values)
- [Element Types](#element-types)
  - [Checkboxes](#checkboxes)
  - [Arrays](#arrays)
    - [Empty Arrays Show A Blank First Row](#empty-arrays-show-a-blank-first-row)
  - [Dropdown Select Boxes](#dropdown-select-boxes)
    - [The Automatic "None" Option](#the-automatic-none-option)
  - [Typeahead Data Lists](#typeahead-data-lists)
  - [Choosing A Different Widget](#choosing-a-different-widget)
- [Help Text](#help-text)
- [Validators](#validators)
  - [String Length](#string-length)
  - [Number Range](#number-range)
  - [Pattern](#pattern)
  - [Format](#format)
- [Conditional Display](#conditional-display)
- [Header and Footer Display](#header-and-footer-display)
- [Translated Schemas](#translated-schemas)
- [Dynamic Schemas](#dynamic-schemas)
- [Limitations and Workarounds](#limitations-and-workarounds)
  - [User-Defined Keys](#user-defined-keys)
- [Advanced Requirements](#advanced-requirements)

Looking for complete, real-world schemas? See [Schema Examples](/#/config-screen/schema-examples).

### Form Generator Playground

The forms are generated using [ng-formworks](https://github.com/zahmo/ng-formworks), the maintained fork of Angular JSON Schema Form. You can test your schema and form layout in its [demonstration playground](https://zahmo.github.io/ng-formworks/) — choose the **bootstrap-5** framework to match what the Homebridge UI renders.

### Basic Structure

```json
{
  "pluginAlias": "Camera-ffmpeg",
  "pluginType": "platform",
  "singular": false,
  "headerDisplay": "Optional content to display above the plugin config. Supports markdown.",
  "footerDisplay": "Optional content to display below the plugin config. Supports markdown.",
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "title": "Name",
        "type": "string"
      }
    },
    "required": ["name"]
  },
  "form": null,
  "display": null
}
```

- `pluginAlias`: The plugin identifier.
- `pluginType`: The type of plugin, valid values are `platform` or `accessory`.
- `singular`: If set to `true` the UI will not allow the user to add more than one config block. This is usually used for platform plugins where only a single config block should be present.
- `headerDisplay` and `footerDisplay`: [See Below](#header-and-footer-display) for details.
- `form` and `display`: These attributes are optional and can be used to further customise how the interface is presented to the user, see the playground for more examples.

_You do not need to include the `platform` or `accessory` attribute in your `schema` object. This will be automatically added based on the `pluginType`._

### Default Values

Setting default values is a great way to ensure your users get up and running as smoothly as possible - to do this just add the `default` attribute with the desired value:

```json
{
  "pluginAlias": "daikin-esp8266-platform",
  "pluginType": "platform",
  "singular": true,
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "title": "Name",
        "type": "string",
        "default": "Daikin AC"
      }
    },
    "required": ["name"]
  }
}
```

### Placeholder Values

Placeholder values should be used for optional fields that have a default value defined in your plugins code. The placeholder value will not be saved to the `config.json` unless modified by the user.

```json
{
  "pluginAlias": "daikin-esp8266-platform",
  "pluginType": "platform",
  "singular": true,
  "schema": {
    "type": "object",
    "properties": {
      "minTemp": {
        "title": "Minimum Temperature",
        "type": "number",
        "placeholder": "18"
      }
    }
  }
}
```

### Element Types

#### Checkboxes

Checkboxes return `true` or `false` and can be implemented using the JSON Schema `boolean` type.

```json
{
  "pluginAlias": "config",
  "pluginType": "platform",
  "schema": {
    "type": "object",
    "properties": {
      "sudo": {
        "title": "Use Sudo",
        "type": "boolean"
      }
    }
  }
}
```

```json
{
  "sudo": true
}
```

Checkboxes can also build a string of arrays from a pre-defined list. The below example will generate an array named `disabled_modes` with the values `Off`, `Home`, `Night`, or `Away` depending on which checkboxes are selected.

```json
{
  "pluginAlias": "config",
  "pluginType": "platform",
  "schema": {
    "type": "object",
    "properties": {
      "disabled_modes": {
        "title": "Disabled Modes",
        "type": "array",
        "uniqueItems": true,
        "items": {
          "title": "Mode",
          "type": "string",
          "enum": [
            "Off",
            "Home",
            "Night",
            "Away"
          ]
        }
      }
    }
  }
}
```

```json
{
  "disabled_modes": ["Off", "Night"]
}
```

### Arrays

Arrays of any size are supported using the JSON Schema `array` type. Arrays of objects are also supported, see the complex example below.

```json
{
  "pluginAlias": "UniFi Occupancy Sensor",
  "pluginType": "accessory",
  "schema": {
    "type": "object",
    "properties": {
      "watch": {
        "title": "Watched Devices",
        "type": "array",
        "items": {
          "title": "MAC Address",
          "type": "string"
        }
      }
    }
  }
}
```

#### Empty Arrays Show A Blank First Row

When an array has no entries yet, the form still renders the fields for a first item, as if one existed. This is how the underlying form library works, and it has two consequences worth designing around:

- **Defaults inside array items create phantom entries.** If any property inside your array items has a `default`, that blank first row picks the default up — and it will be saved into the user's config as a real entry, even though the user never added one.
- **Required fields inside array items fail validation immediately.** If your item schema marks fields as `required`, the blank first row is invalid the moment the form opens, and the user sees errors for an entry they never created.

There are two reliable ways to avoid this:

1. **Do not mark fields inside array items as `required`.** Validate them in your plugin code instead, and log a clear message when an entry is incomplete. This is the simplest fix and right for most plugins.
2. **Hide the array until the user opts in.** Add a boolean property (for example `addExtraDevices`) and gate the array's form section behind a [conditional display](#conditional-display) rule such as `"condition": {"functionBody": "return model.addExtraDevices"}`. The array's form is then never built — and no blank row exists — until the user asks for it.

Also note: marking the **array itself** as `required` forces the form to demand at least one real entry (it behaves as `minItems: 1`), so only do that when an empty array is genuinely invalid for your plugin.

### Dropdown Select Boxes

Dropdown select boxes can be implemented using the JSON Schema `oneOf` attribute.

```json
{
  "pluginAlias": "config",
  "pluginType": "platform",
  "schema": {
    "type": "object",
    "properties": {
      "auth": {
        "title": "Auth Mode",
        "type": "string",
        "default": "form",
        "oneOf": [
          { "title": "Form", "enum": ["form"] },
          { "title": "Basic Auth", "enum": ["basic"] },
          { "title": "None", "enum": ["none"] }
        ]
      }
    },
    "required": ["auth"]
  }
}
```

#### The Automatic "None" Option

The UI adds its own **None** entry to the top of a dropdown — but only when the property is **not** listed in `required`:

- Selecting **None** removes the property from the user's config entirely. It is how a user resets an optional dropdown back to "not set", so your plugin's own default applies again.
- A **required** dropdown gets no None entry. Once the user has picked a value, the form offers no way to unset it — only editing the JSON config directly can remove it. Only mark a dropdown `required` if your plugin genuinely cannot work without a value.

This automatic entry is different from offering a literal choice named "None" yourself, as the example above does with `{"title": "None", "enum": ["none"]}`. That is a real value — the string `"none"` is saved to the config — which is the right approach when the property is required but "off" is a valid choice your plugin understands.

### Typeahead Data Lists

Data-lists suggest values to the user in a similar way to drop down boxes, but still allowing the user to enter their own value if they like.

```json
{
  "pluginAlias": "config",
  "pluginType": "platform",
  "schema": {
    "type": "object",
    "properties": {
      "vcodec": {
        "title": "Video Codec",
        "type": "string",
        "placeholder": "libx264",
        "description": "The ffmpeg video processing codec to use.",
        "typeahead": {
          "source": [
            "libx264",
            "copy",
            "h264_omx",
            "h264",
            "h264_mmal"
          ]
        }
      }
    }
  }
}
```

#### Choosing A Different Widget

The input each property gets is chosen automatically from its `type` and `format`, but you can override it with the `widget` attribute:

```json
{
  "notes": {
    "title": "Notes",
    "type": "string",
    "widget": "textarea"
  },
  "startDateTime": {
    "title": "Start Date-Time",
    "type": "string",
    "format": "iso-date-time",
    "widget": "datetime-local",
    "x-inputAttributes": { "step": 1 }
  }
}
```

Useful widget names include `textarea`, `password`, `hidden`, `datetime-local`, `date`, `time`, `color`, `range`, `radios` and `select`. The optional `x-inputAttributes` object sets extra HTML attributes on the rendered input — in the example above, `step: 1` gives the date-time picker second-level precision.

### Help Text

Help text can be added below each input using the `description` attribute.

```json
{
  "pluginAlias": "Camera-ffmpeg",
  "pluginType": "platform",
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "title": "Name",
        "type": "string",
        "description": "The name of the plugin"
      }
    },
    "required": ["name"]
  }
}
```

### Validators

#### String Length

The min and max string length can be set using the `minLength` and `maxLength` JSON Schema attributes. Both are optional.

```json
{
  "pluginAlias": "Camera-ffmpeg",
  "pluginType": "platform",
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "title": "Name",
        "type": "string",
        "minLength": 4,
        "maxLength": 10
      }
    }
  }
}
```

#### Number Range

Numeric input can be validated using the `minimum` and `maximum` JSON Schema attributes. Providing both a min and max value will display a range slider to the user.

```json
{
  "pluginAlias": "Camera-ffmpeg",
  "pluginType": "platform",
  "schema": {
    "type": "object",
    "properties": {
      "timeout": {
        "title": "Timeout",
        "type": "integer",
        "minimum": 15,
        "maximum": 3000
      }
    }
  }
}
```

#### Pattern

You can validate the user's input using a regex in the JSON Schema `pattern` attribute.

```json
{
  "pluginAlias": "UniFi Occupancy Sensor",
  "pluginType": "accessory",
  "schema": {
    "type": "object",
    "properties": {
      "mac": {
        "title": "MAC Address",
        "type": "string",
        "pattern": "^([A-Fa-f0-9]{2}:){5}[A-Fa-f0-9]{2}$"
      }
    }
  }
}
```

#### Format

You can also use the built-in `format` types to validate the data:

- `date-time`: Date representation, as defined by RFC 3339, section 5.6.
- `email`: Internet email address, see RFC 5322, section 3.4.1.
- `hostname`: Internet hostname, see RFC 1034, section 3.1.
- `ipv4`: IPv4 address, according to dotted-quad ABNF syntax as defined in RFC 2673, section 3.2.
- `ipv6`: IPv6 address, as defined in RFC 2373, section 2.2.
- `uri`: A universal resource identifier (URI), according to RFC3986.
- `uuid`: A universally unique identifier, as defined in RFC 4122.

Some formats do more than validate — they change the input the user gets:

- `color`: renders a colour picker; the chosen colour is saved as a hex string.
- `date`: renders a date picker.
- `email`: renders an email input.
- `uri`: renders a URL input.

Every other format renders a normal text input and only validates what is typed.

Example:

```json
{
  "pluginAlias": "UniFi Occupancy Sensor",
  "pluginType": "accessory",
  "schema": {
    "type": "object",
    "properties": {
      "host": {
        "title": "IP Address / Hostname",
        "type": "string",
        "format": "hostname"
      }
    },
    "required": ["host"]
  }
}
```

### Conditional Display

You can set rules for when a field should be displayed or hidden. For example, you might only show some fields, based on the value of another.

```json
{
  "condition": {
    "functionBody": "return model.blah === 'foo';"
  }
}
```

`functionBody` is called with `model` and `arrayIndices` as arguments and should return a `boolean` value.

- `model` - the current object representation of the current plugin config.
- `arrayIndices` - if the condition is being called inside an array, this is the array index of the current item.

Full Example:

```json
{
  "pluginAlias": "BelkinWeMo",
  "pluginType": "platform",
  "schema": {
    "type": "object",
    "properties": {
      "name": {
        "title": "Name",
        "type": "string",
        "default": "WeMo Platform"
      },
      "showOption": {
        "title": "Should Show Other Option",
        "type": "boolean"
      },
      "thatOtherOption": {
        "title": "This option is hidden unless `showOption` is true",
        "type": "string",
        "condition": {
          "functionBody": "return model.showOption === true;"
        }
      }
    },
    "required": ["name"]
  }
}
```

### Header and Footer Display

Plugin authors can display additional content in the user interface above and below the config form using the `headerDisplay` and `footerDisplay` attributes. These displays support markdown and plain text.

Things to keep in mind when creating displays:

- Keep it short. Screen real estate is limited, rather than displaying your entire setup guide it might be better to provide a link to your wiki instead.
- Remote images are supported when using the full image URI.
  - Images may only be loaded from `https://raw.githubusercontent.com`.
- Absolutely no HTML tags. GitHub flavoured markdown supports some HTML tags such as `a` and `img`. We do not, these tags will not be rendered in the interface.
- Custom JavaScript is not supported anywhere.

### Translated Schemas

You can ship translated versions of your whole schema, and the UI will serve the one matching the user's interface language.

Declare a directory in your `package.json`:

```json
{
  "directories": {
    "schemas": "schemas/"
  }
}
```

Then publish translated schema files in that directory, named `config.schema.<lang>.json` — for example `schemas/config.schema.de.json` for German. Each file is a complete schema in the same format as `config.schema.json`, with the titles and descriptions translated. When the Homebridge UI language is not English and a matching file exists, it is served instead of the root `config.schema.json`; otherwise the root file is used.

[homebridge-dummy](https://github.com/mpatfield/homebridge-dummy) uses this — it generates the translated schema files from a template at build time, which keeps the translations in one place.

### Dynamic Schemas

A plugin can replace its shipped schema with one it generates at runtime — useful when the choices you want to offer are only known after connecting to an account or discovering devices, for example a dropdown listing the user's actual devices.

Declare a schema version in your shipped `config.schema.json`:

```json
{
  "pluginAlias": "ExamplePlatform",
  "pluginType": "platform",
  "dynamicSchemaVersion": "1",
  "schema": { "...": "..." }
}
```

When this attribute is present, the Homebridge UI looks for a file named `.<plugin-name>-v<version>.schema.json` in the Homebridge storage directory — for the example above, `.homebridge-example-plugin-v1.schema.json` — and serves that instead of the shipped schema whenever it exists and is valid JSON. Your plugin writes this file at runtime, using the storage path from `api.user.storagePath()`. The file uses the same format as `config.schema.json`.

Things to keep in mind:

- If the generated file is missing or unreadable, the UI falls back to the shipped schema — so the shipped schema should stand on its own for a first run.
- The version is part of the filename. When a plugin update changes the shape of the generated schema, bump `dynamicSchemaVersion` so stale files written by older versions are ignored rather than served.

### Limitations and Workarounds

#### User-Defined Keys

A small number of existing plugin configs may not work with the automatically generated forms. Specifically, the JSON Schema `patternProperties` attribute is not supported. The `patternProperties` attribute would be used when the plugin requires user-defined keys. Since this is not supported plugin authors should swap such config blocks to use `arrays` instead.

Here is an example Homebridge config block that we can't generate a form for because it depends on user-defined key names:

```json
{
  "platforms": [
    {
      "platform": "Some Platform",
      "users": {
        "user-one": "password",
        "user-two": "password"
      }
    }
  ]
}
```

This can be fixed by changing the config to use an `array` instead of an `object`:

```json
{
  "platforms": [
    {
      "platform": "Some Platform",
      "users": [
        { "key": "user-one", "value": "password" },
        { "key": "user-two", "value": "password" }
      ]
    }
  ]
}
```

The `config.schema.json` file would then look like this:

```json
{
  "pluginAlias": "Some Platform",
  "pluginType": "platform",
  "schema": {
    "type": "object",
    "properties": {
      "users": {
        "title": "Users",
        "type": "array",
        "items": {
          "title": "User",
          "type": "object",
          "properties": {
            "key": {
              "title": "Username",
              "type": "string"
            },
            "value": {
              "title": "Password",
              "type": "string"
            }
          },
          "required": ["key", "value"]
        }
      }
    }
  }
}
```

If the plugin requires the config block to be put back into the original `object` format they can easily transform the `array` at runtime:

```js
const users = {}
config.users.forEach(x => users[x.key] = x.value)
```

### Advanced Requirements

If you have more complex requirements than what the standard `config.schema.json` syntax can support; for example, an OAUTH2 workflow, or exchanging username and password for a token, you can create a fully [custom configuration user interface](/#/config-screen/custom-ui).
