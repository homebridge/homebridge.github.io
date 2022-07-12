# Plugin Config Schema

By adding a config schema to your plugin, users will be able to configure your plugin in the Homebridge UI without having to manually edit the Homebridge `config.json` file. 

Plugin authors should publish a `config.schema.json` file which defines the config their plugin requires in the JSON Schema format (v6, v4 or v3).

- [Enabling Support For Your Plugin](#enabling-support-for-your-plugin)
- [Form Generator Playground](#form-generator-playground)
- [Basic Structure](#basic-structure)
- [Default Values](#default-values)
- [Placeholder Values](#placeholder-values)
- [Element Types](#element-types)
  * [Checkboxes](#checkboxes)
  * [Arrays](#arrays)
  * [Dropdown Select Boxes](#dropdown-select-boxes)
  * [Typeahead Data Lists](#typeahead-data-lists)
- [Help Text](#help-text)
- [Validators](#validators)
  * [String Length](#string-length)
  * [Number Range](#number-range)
  * [Pattern](#pattern)
  * [Format](#format)
- [Conditional Display](#conditional-display)
- [Header and Footer Display](#header-and-footer-display)
- [Simple Example](#simple-example)
- [Complex Example](#complex-example)
- [Limitations and Workarounds](#limitations-and-workarounds)
  * [User-Defined Keys](#user-defined-keys)
- [Advanced Requirements](#advanced-requirements)
- [Plugins Using This](#plugins-using-this)

### Enabling Support For Your Plugin

To add support for a GUI settings page for your plugin, all you need to do is define and publish the `config.schema.json` as part of your npm package. Homebridge Config UI X will detect this file and show the `Settings` button on the plugin page:

![image](https://user-images.githubusercontent.com/3979615/58320524-29cffc00-7e5f-11e9-94e1-114cd77c18c4.png)

The config schema supports both **Platform** and **Accessory** plugin types.

### Form Generator Playground

The forms are generated using [Angular JSON Schema Form](https://github.com/hamzahamidi/ajsf), you can test your schema and form layout using the [demonstration playground](https://hamidihamza.com/ajsf/?framework=bootstrap-4).

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
        "type": "string",
        "required": true
      }
    }
  },
  "form": null,
  "display": null
}
```

* `pluginAlias`: The plugin identifier.
* `pluginType`: The type of plugin, valid values are `platform` or `accessory`.
* `singular`: If set to `true` the UI will not allow the user to add more than one config block. This is usually used for platform plugins where only a single config block should be present.
* `headerDisplay` and `footerDisplay`: [See Below](#header-and-footer-display) for details.
* `form` and `display`: These attributes are optional and can be used to further customise how the interface is presented to the user, see the playground for more examples.

*You do not need to include the `platform` or `accessory` attribute in your `schema` object. This will be automatically added based on the `pluginType`.*

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
        "default": "Daikin AC",
        "required": true
      }
    }
  }
}
```

### Placeholder Values

Placeholder values should be used for optional fields that have a default value defined in your plugins code. The place holder value will not be saved to the `config.json` unless modified by the user.

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
"sudo": true
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
"disabled_modes": ["Off", "Night"]
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
        ],
        "required": true
      }
    }
  }
}
```

### Typeahead Data Lists

Datalists suggest values to the user in a similar way to drop down boxes, but still allowing the user to enter their own value if they like.

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
        "required": true,
        "description": "The name of the plugin"
      }
    }
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

* `date-time`: Date representation, as defined by RFC 3339, section 5.6.
* `email`: Internet email address, see RFC 5322, section 3.4.1.
* `hostname`: Internet hostname, see RFC 1034, section 3.1.
* `ipv4`: IPv4 address, according to dotted-quad ABNF syntax as defined in RFC 2673, section 3.2.
* `ipv6`: IPv6 address, as defined in RFC 2373, section 2.2.
* `uri`: A universal resource identifier (URI), according to RFC3986.

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
        "required": true,
        "format": "hostname"
      }
    }
  }
}
```

### Conditional Display

You can set rules for when a field should be displayed or hidden. For example, you might only show some fields, based on the value of another.

```json
"condition": {
  "functionBody": "return model.blah === 'foo';"
}
```

`functionBody` is called with `model` and `arrayIndices` as arguments and should return a `boolean` value.

* `model` - the current object representation of the current plugin config.
* `arrayIndices` - if the condition is being called inside an array, this is the array index of the current item.

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
        "default": "WeMo Platform",
        "required": true
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
    }
  }
}
```

### Header and Footer Display

Plugin authors can display additional content in the user interface above and below the config form using the `headerDisplay` and `footerDisplay` attributes. These displays support markdown and plain text.

Things to keep in mind when creating displays:

* Keep it short. Screen real estate is limited, rather than displaying your entire setup guide it might be better to provide a link to your wiki instead.
* Remote images are supported when using the full image URI.
  * Images may only be loaded from `https://raw.githubusercontent.com`.
* Absolutely no HTML tags. GitHub flavoured markdown supports some HTML tags such as `a` and `img`. We do not, these tags will not be rendered in the interface.
* Custom JavaScript is not supported anywhere.

### Simple Example

This example shows the simplest `config.schema.json` example.

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
        "default": "WeMo Platform",
        "required": true
      }
    }
  }
}
```

### Complex Example

This example shows the config schema for [Sunoo/homebridge-camera-ffmpeg](https://github.com/Sunoo/homebridge-camera-ffmpeg). The user interface will allow users to add to the array of cameras, and includes a custom layout:

```json
{
  "pluginAlias": "Camera-ffmpeg",
  "pluginType": "platform",
  "singular": true,
  "headerDisplay": "Cameras are exposed to HomeKit as separate accessories and each needs to be manually paired.\n\n1. Open the Home <img src='https://user-images.githubusercontent.com/3979615/78010622-4ea1d380-738e-11ea-8a17-e6a465eeec35.png' height='16.42px'> app on your device.\n2. Tap the Home tab, then tap <img src='https://user-images.githubusercontent.com/3979615/78010869-9aed1380-738e-11ea-9644-9f46b3633026.png' height='16.42px'>.\n3. Tap *Add Accessory*, and select *I Don't Have a Code or Cannot Scan*.\n4. Enter the Homebridge PIN, this can be found under the QR code in Homebridge UI or your Homebridge logs, alternatively you can select *Use Camera* and scan the QR code again.\n\nFor help and examples of common configurations please read the [wiki](https://github.com/KhaosT/homebridge-camera-ffmpeg/wiki).",
  "footerDisplay": "The **ffmpeg** binary must be installed on your system for this plugin to work.",
  "schema": {
    "name": {
      "title": "Name",
      "type": "string"
    },
    "videoProcessor": {
      "title": "Video Processor",
      "type": "string"
    },
    "interfaceName": {
      "title": "Interface Name",
      "type": "string"
    },
    "cameras": {
      "type": "array",
      "items": {
        "title": "Cameras",
        "type": "object",
        "properties": {
          "name": {
            "title": "Name",
            "type": "string",
            "placeholder": "Enter camera name...",
            "required": true
          },
          "uploader": {
            "type": "boolean"
          },
          "manufacturer": {
            "type": "string"
          },
          "model": {
            "type": "string"
          },
          "serialNumber": {
            "type": "string"
          },
          "firmwareRevision": {
            "type": "string"
          },
          "motion": {
            "title": "Enable IOS 13 Motion Notifications",
            "type": "boolean"
          },
          "videoConfig": {
            "title": "Video Configuration",
            "type": "object",
            "properties": {
              "source": {
                "title": "Source",
                "type": "string",
                "placeholder": "-re -i rtsp://myfancy_rtsp_stream",
                "required": true
              },
              "stillImageSource": {
                "title": "Still Image Source",
                "type": "string"
              },
              "maxStreams": {
                "title": "Maximum Number of Streams",
                "type": "integer",
                "placeholder": 2,
                "minimum": 1,
                "description": "The maximum number of streams that will be generated for this camera"
              },
              "maxWidth": {
                "title": "Maximum Width",
                "type": "integer",
                "placeholder": 1280,
                "minimum": 1,
                "description": "The maximum width reported to HomeKit"
              },
              "maxHeight": {
                "title": "Maximum Height",
                "type": "integer",
                "placeholder": 720,
                "minimum": 1,
                "description": "The maximum height reported to HomeKit"
              },
              "maxFPS": {
                "title": "Maximum FPS",
                "type": "integer",
                "placeholder": 10,
                "minimum": 1,
                "description": "The maximum frame rate of the stream"
              },
              "maxBitrate": {
                "title": "Maximum Bitrate",
                "type": "integer",
                "placeholder": 300,
                "minimum": 1,
                "description": "The maximum bit rate of the stream"
              },
              "preserveRatio": {
                "title": "Preserve Ratio",
                "type": "string",
                "description": "Can be set to either 'W' or 'H' with respective obvious meanings.",
                "typeahead": {
                  "source": [
                    "W",
                    "H"
                  ]
                }
              },
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
              },
              "packetSize": {
                "title": "Packet Size",
                "type": "number",
                "placeholder": 1316,
                "multipleOf": 188.0
              },
              "videoFilter": {
                "title": "Allows a custom video filter to be passed to FFmpeg via -vf",
                "type": "string",
                "placeholder": "scale=1280:720"
              },
              "additionalCommandline": {
                "title": "Additional of extra command line options",
                "type": "string",
                "description": "Additional of extra command line options to use with FFmpeg, for example '-loglevel verbose'"
              },
              "mapvideo": {
                "type": "string",
                "title": "Map Video",
                "placeholder": "0:0",
                "description": " Select the stream used for video"
              },
              "mapaudio": {
                "type": "string",
                "title": "Map Audio",
                "placeholder": "0:1",
                "description": " Select the stream used for audio"
              },
              "audio": {
                "title": "Enable Audio (requires ffmpeg with libfdk-aac)",
                "type": "boolean"
              },
              "vflip": {
                "title": "Flip Stream Vertically",
                "type": "boolean"
              },
              "hflip": {
                "title": "Flip Stream Horizontally",
                "type": "boolean"
              },
              "debug": {
                "title": "Enable Debug Mode",
                "type": "boolean"
              }
            }
          }
        }
      }
    }
  },
  "layout": [
    {
      "key": "cameras",
      "type": "array",
      "orderable": false,
      "buttonText": "Add Camera",
      "items": [
        "cameras[].name",
        "cameras[].videoConfig.source",
        "cameras[].videoConfig.stillImageSource",
        "cameras[].videoConfig.vcodec",
        "cameras[].videoConfig.audio",
        "cameras[].videoConfig.debug",
        {
          "key": "cameras[].videoConfig",
          "type": "section",
          "title": "Advanced Settings",
          "expandable": true,
          "expanded": false,
          "items": [
            "cameras[].videoConfig.maxStreams",
            "cameras[].videoConfig.maxWidth",
            "cameras[].videoConfig.maxHeight",
            "cameras[].videoConfig.maxFPS",
            "cameras[].videoConfig.maxBitrate",
            "cameras[].videoConfig.preserveRatio",
            "cameras[].videoConfig.packetSize",
            "cameras[].videoConfig.videoFilter",
            "cameras[].videoConfig.additionalCommandline",
            "cameras[].videoConfig.mapvideo",
            "cameras[].videoConfig.mapaudio",
            "cameras[].videoConfig.vflip",
            "cameras[].videoConfig.hflip",
            "cameras[].motion"
          ]
        }
      ]
    }
  ]
}
```

### Limitations and Workarounds

#### User-Defined Keys

A small number of existing plugin configs may not work with the automatically generated forms. Specifically, the JSON Schema `patternProperties` attribute is not supported. The `patternProperties` attribute would be used when the plugin requires user-defined keys. Since this is not supported plugin authors should swap such config blocks to use `arrays` instead.

Here is an example Homebridge config block that we can't generate a form for because it depends on user-defined key names:

```json
"platforms": [
  {
    "platform": "Some Platform",
    "users": {
      "user-one": "password",
      "user-two": "password"
    }
  }
]
```

This can be fixed by changing the config to use an `array` instead of an `object`:

```json
"platforms": [
  {
    "platform": "Some Platform",
    "users": [
      { "key": "user-one", "value": "password" },
      { "key": "user-two", "value": "password" }
    ]
  }
]
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
              "type": "string",
              "required": true
            },
            "value": {
              "title": "Password",
              "type": "string",
              "required": true
            }
          }
        }
      }
    }
  }
}
```

If the plugin requires the config block to be put back into the original `object` format they can easily transform the `array` at runtime:

```js
const users = {};
config.users.forEach(x => users[x.key] = x.value);
```

### Advanced Requirements

If you have more complex requirements than what the standard `config.schema.json` syntax can support; for example, an OAUTH2 workflow, or exchanging username and password for a token, you can create a fully custom configuration user interface using the [@homebridge/plugin-ui-utils](https://github.com/homebridge/plugin-ui-utils) tools.

### Plugins Using This

Looking at example of existing schemas is a great way to learn.

These are examples of plugins that currently implement the Plugin Settings GUI using the `config.schema.json`:

* [homebridge-433-arduino](https://github.com/normen/homebridge-433-arduino/blob/master/config.schema.json)
* [homebridge-aladdin-connect-garage-door](https://github.com/iAnatoly/homebridge-aladdin-connect-garage-door/blob/master/config.schema.json)
* [homebridge-alexa](https://github.com/NorthernMan54/homebridge-alexa/blob/master/config.schema.json)
* [homebridge-apple-tv-remote](https://github.com/lukasroegner/homebridge-apple-tv-remote/blob/master/config.schema.json)
* [homebridge-automation-chromecast](https://github.com/paolotremadio/homebridge-automation-chromecast/blob/master/config.schema.json)
* [homebridge-automower](https://github.com/nicoduj/homebridge-automower/blob/master/config.schema.json)
* [homebridge-blink](https://github.com/jonathandann/homebridge-blink/blob/master/config.schema.json)
* [homebridge-bravia](https://github.com/normen/homebridge-bravia/blob/master/config.schema.json)
* [homebridge-button-platform](https://github.com/Djelibeybi/homebridge-button-platform/blob/master/config.schema.json)
* [homebridge-camera-ffmpeg](https://github.com/KhaosT/homebridge-camera-ffmpeg/blob/master/config.schema.json)
* [homebridge-canary](https://github.com/reinierlakhan/homebridge-canary/blob/master/config.schema.json)
* [homebridge-comelit-hub](https://github.com/madchicken/homebridge-comelit-hub/blob/master/config.schema.json)
* [homebridge-config-ui-x](https://github.com/oznu/homebridge-config-ui-x/blob/master/config.schema.json)
* [homebridge-connex](https://github.com/NorthernMan54/homebridge-connex/blob/master/config.schema.json)
* [homebridge-chamberlain](https://github.com/caseywebdev/homebridge-chamberlain/blob/master/config.schema.json)
* [homebridge-daikin-esp8266](https://github.com/oznu/homebridge-daikin-esp8266/blob/master/config.schema.json)
* [homebridge-denon-tv](https://github.com/grzegorz914/homebridge-denon-tv/blob/master/config.schema.json)
* [homebridge-dummy](https://github.com/nfarina/homebridge-dummy/blob/master/config.schema.json)
* [homebridge-dummy-lock](https://github.com/karlg100/homebridge-dummy-lock/blob/master/config.schema.json)
* [homebridge-dummy-thermostat](https://github.com/X1ZOR/homebridge-dummy-thermostat/blob/master/config.schema.json)
* [homebridge-dyson-pure-cool](https://github.com/lukasroegner/homebridge-dyson-pure-cool/blob/master/config.schema.json)
* [homebridge-esp-irrigation-controller](https://github.com/oznu/esp-irrigation-controller/blob/master/homebridge/config.schema.json)
* [homebridge-esp-pir](https://github.com/oznu/homebridge-esp-pir/blob/master/config.schema.json)
* [homebridge-esp8266-fan](https://github.com/oznu/homebridge-esp8266-fan/blob/master/config.schema.json)
* [homebridge-ecoplug](https://github.com/Danimal4326/homebridge-ecoplug/blob/master/config.schema.json)
* [homebridge-eveatmo](https://github.com/skrollme/homebridge-eveatmo/blob/master/config.schema.json)
* [homebridge-g-on-alice](https://github.com/G-On-dev/homebridge-g-on-alice/blob/master/config.schema.json)
* [homebridge-gogogate2](https://github.com/nicoduj/homebridge-gogogate2/blob/DynamicPlatform/config.schema.json)
* [homebridge-gsh](https://github.com/oznu/homebridge-gsh/blob/master/config.schema.json)
* [homebridge-harmony](https://github.com/nicoduj/homebridge-harmony/blob/Dynamic-Platform/config.schema.json)
* [homebridge-homeconnect](https://github.com/thoukydides/homebridge-homeconnect/blob/master/config.schema.json)
* [homebridge-homeqtt-alarm](https://github.com/nzbullet/homebridge-homeqtt-alarm/blob/master/config.schema.json)
* [homebridge-honeywell-home](https://github.com/donavanbecker/homebridge-honeywell-home/blob/master/config.schema.json)
* [homebridge-honeywell-leak](https://github.com/sunoo/homebridge-honeywell-leak/blob/master/config.schema.json)
* [homebridge-hue](https://github.com/ebaauw/homebridge-hue/blob/master/config.schema.json)
* [homebridge-landroid](https://github.com/normen/homebridge-landroid/blob/master/config.schema.json)
* [homebridge-lgwebos-tv](https://github.com/grzegorz914/homebridge-lgwebos-tv/blob/master/config.schema.json)
* [homebridge-luxtronik2](https://github.com/cbrandlehner/homebridge-luxtronik2/blob/master/config.schema.json)
* [homebridge-meross](https://github.com/donavanbecker/homebridge-meross/blob/master/config.schema.json)
* [homebridge-mi-hygrothermograph](https://github.com/hannseman/homebridge-mi-hygrothermograph/blob/master/config.schema.json)
* [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing/blob/master/config.schema.json)
* [homebridge-music](https://github.com/ebaauw/homebridge-music/blob/master/config.schema.json)
* [homebridge-mysmartblinds-bridge](https://github.com/apexad/homebridge-mysmartblinds-bridge/blob/master/config.schema.json)
* [homebridge-neato](https://github.com/naofireblade/homebridge-neato/blob/master/config.schema.json)
* [homebridge-nest](https://github.com/chrisjshull/homebridge-nest/blob/master/config.schema.json)
* [homebridge-onkyo](https://github.com/ToddGreenfield/homebridge-onkyo/blob/master/config.schema.json)
* [homebridge-openwebif-tv](https://github.com/grzegorz914/homebridge-openwebif-tv/blob/master/config.schema.json)
* [homebridge-otgw](https://github.com/ebaauw/homebridge-otgw/blob/master/config.schema.json)
* [homebridge-p1](https://github.com/ebaauw/homebridge-p1/blob/master/config.schema.json)
* [homebridge-pihole](https://github.com/arendruni/homebridge-pihole/blob/master/config.schema.json)
* [homebridge-platform-maxcube](https://github.com/normen/homebridge-platform-maxcube/blob/master/config.schema.json)
* [homebridge-platform-wemo](https://github.com/rudders/homebridge-platform-wemo/blob/master/config.schema.json)
* [homebridge-ring](https://github.com/dgreif/ring/blob/master/homebridge/config.schema.json)
* [homebridge-rpi](https://github.com/ebaauw/homebridge-rpi/blob/master/config.schema.json)
* [homebridge-sengled](https://github.com/j796160836/homebridge-sengled/blob/master/config.schema.json)
* [homebridge-smartglass](https://github.com/unknownskl/homebridge-smartglass/blob/master/config.schema.json)
* [homebridge-smartthings-v2](https://github.com/tonesto7/homebridge-smartthings-v2/blob/master/config.schema.json)
* [homebridge-sonos](https://github.com/nfarina/homebridge-sonos/blob/master/config.schema.json)
* [homebridge-sunricher-wifi](https://github.com/break-pointer/homebridge-sunricher-wifi/blob/master/config.schema.json)
* [homebridge-tesla](https://github.com/nfarina/homebridge-tesla/blob/master/config.schema.json)
* [homebridge-tion](https://github.com/break-pointer/homebridge-tion/blob/master/config.schema.json)
* [homebridge-tydom](https://github.com/mgcrea/homebridge-tydom/blob/master/config.schema.json)
* [homebridge-ueboom](https://github.com/alessandroaime/homebridge-ueboom/blob/master/config.schema.json)
* [homebridge-unifi-occupancy-sensor](https://github.com/oznu/homebridge-unifi-occupancy-sensor/blob/master/config.schema.json)
* [homebridge-videodoorbell](https://github.com/Samfox2/homebridge-videodoorbell/blob/master/config.schema.json)
* [homebridge-webos-tv](https://github.com/merdok/homebridge-webos-tv/blob/master/config.schema.json)
* [homebridge-weather-plus](https://github.com/naofireblade/homebridge-weather-plus/blob/master/config.schema.json)
* [homebridge-ws](https://github.com/ebaauw/homebridge-ws/blob/master/config.schema.json)
* [homebridge-xbox-tv](https://github.com/grzegorz914/homebridge-xbox-tv/blob/master/config.schema.json)
* [homebridge-yalesmarthomealarm](https://github.com/jak1502/homebridge-yalesmarthomealarm/blob/master/config.schema.json)
* [homebridge-zigbee](https://github.com/itsmepetrov/homebridge-zigbee/blob/master/config.schema.json)
* [homebridge-zp](https://github.com/ebaauw/homebridge-zp/blob/master/config.schema.json)

[homebridge-zp](https://github.com/ebaauw/homebridge-zp/blob/master/config.schema.json) screenshot (dark mode theme):

![image](https://user-images.githubusercontent.com/3979615/63856581-54dd6500-c9e5-11e9-8b6f-41790726d3f9.png)

[homebridge-config-ui-x](https://github.com/oznu/homebridge-config-ui-x/blob/master/config.schema.json) screenshot:

![image](https://user-images.githubusercontent.com/3979615/63856715-9b32c400-c9e5-11e9-919c-0b82355e3b92.png)

[homebridge-alexa](https://github.com/NorthernMan54/homebridge-alexa/blob/master/config.schema.json) screenshot:

![image](https://user-images.githubusercontent.com/3979615/63856789-cfa68000-c9e5-11e9-91ef-b9e1c9e26fe4.png)
