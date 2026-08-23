# Config Schema Examples

Complete `config.schema.json` files, from minimal to fully featured. The file format itself is documented on the [Config Schema](/#/config-screen/schema) page.

- [Simple Example](#simple-example)
- [Complex Example](#complex-example)
- [Plugins Using This](#plugins-using-this)

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
        "default": "WeMo Platform"
      }
    },
    "required": ["name"]
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
            "placeholder": "Enter camera name..."
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
                "placeholder": "-re -i rtsp://myfancy_rtsp_stream"
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
            },
            "required": ["source"]
          }
        },
        "required": ["name"]
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

### Plugins Using This

Looking at examples of existing schemas is a great way to learn.

These are examples of plugins that currently implement the Plugin Settings GUI using the `config.schema.json`:

- [homebridge-433-arduino](https://github.com/normen/homebridge-433-arduino/blob/master/config.schema.json)
- [homebridge-aladdin-connect-garage-door](https://github.com/iAnatoly/homebridge-aladdin-connect-garage-door/blob/master/config.schema.json)
- [homebridge-alexa](https://github.com/NorthernMan54/homebridge-alexa/blob/master/config.schema.json)
- [homebridge-apple-tv-remote](https://github.com/lukasroegner/homebridge-apple-tv-remote/blob/master/config.schema.json)
- [homebridge-automation-chromecast](https://github.com/paolotremadio/homebridge-automation-chromecast/blob/master/config.schema.json)
- [homebridge-automower](https://github.com/nicoduj/homebridge-automower/blob/master/config.schema.json)
- [homebridge-blink](https://github.com/jonathandann/homebridge-blink/blob/master/config.schema.json)
- [homebridge-bravia](https://github.com/normen/homebridge-bravia/blob/master/config.schema.json)
- [homebridge-button-platform](https://github.com/Djelibeybi/homebridge-button-platform/blob/master/config.schema.json)
- [homebridge-camera-ffmpeg](https://github.com/KhaosT/homebridge-camera-ffmpeg/blob/master/config.schema.json)
- [homebridge-canary](https://github.com/reinierlakhan/homebridge-canary/blob/master/config.schema.json)
- [homebridge-comelit-hub](https://github.com/madchicken/homebridge-comelit-hub/blob/master/config.schema.json)
- [homebridge-config-ui-x](https://github.com/oznu/homebridge-config-ui-x/blob/master/config.schema.json)
- [homebridge-connex](https://github.com/NorthernMan54/homebridge-connex/blob/master/config.schema.json)
- [homebridge-chamberlain](https://github.com/caseywebdev/homebridge-chamberlain/blob/master/config.schema.json)
- [homebridge-daikin-esp8266](https://github.com/oznu/homebridge-daikin-esp8266/blob/master/config.schema.json)
- [homebridge-denon-tv](https://github.com/grzegorz914/homebridge-denon-tv/blob/master/config.schema.json)
- [homebridge-dummy](https://github.com/nfarina/homebridge-dummy/blob/master/config.schema.json)
- [homebridge-dummy-lock](https://github.com/karlg100/homebridge-dummy-lock/blob/master/config.schema.json)
- [homebridge-dummy-thermostat](https://github.com/X1ZOR/homebridge-dummy-thermostat/blob/master/config.schema.json)
- [homebridge-dyson-pure-cool](https://github.com/lukasroegner/homebridge-dyson-pure-cool/blob/master/config.schema.json)
- [homebridge-esp-irrigation-controller](https://github.com/oznu/esp-irrigation-controller/blob/master/homebridge/config.schema.json)
- [homebridge-esp-pir](https://github.com/oznu/homebridge-esp-pir/blob/master/config.schema.json)
- [homebridge-esp8266-fan](https://github.com/oznu/homebridge-esp8266-fan/blob/master/config.schema.json)
- [homebridge-ecoplug](https://github.com/Danimal4326/homebridge-ecoplug/blob/master/config.schema.json)
- [homebridge-eveatmo](https://github.com/skrollme/homebridge-eveatmo/blob/master/config.schema.json)
- [homebridge-g-on-alice](https://github.com/G-On-dev/homebridge-g-on-alice/blob/master/config.schema.json)
- [homebridge-gogogate2](https://github.com/nicoduj/homebridge-gogogate2/blob/DynamicPlatform/config.schema.json)
- [homebridge-gsh](https://github.com/oznu/homebridge-gsh/blob/master/config.schema.json)
- [homebridge-harmony](https://github.com/nicoduj/homebridge-harmony/blob/Dynamic-Platform/config.schema.json)
- [homebridge-homeconnect](https://github.com/thoukydides/homebridge-homeconnect/blob/master/config.schema.json)
- [homebridge-homeqtt-alarm](https://github.com/nzbullet/homebridge-homeqtt-alarm/blob/master/config.schema.json)
- [homebridge-honeywell-home](https://github.com/donavanbecker/homebridge-honeywell-home/blob/master/config.schema.json)
- [homebridge-honeywell-leak](https://github.com/sunoo/homebridge-honeywell-leak/blob/master/config.schema.json)
- [homebridge-hue](https://github.com/ebaauw/homebridge-hue/blob/master/config.schema.json)
- [homebridge-landroid](https://github.com/normen/homebridge-landroid/blob/master/config.schema.json)
- [homebridge-lgwebos-tv](https://github.com/grzegorz914/homebridge-lgwebos-tv/blob/master/config.schema.json)
- [homebridge-luxtronik2](https://github.com/cbrandlehner/homebridge-luxtronik2/blob/master/config.schema.json)
- [homebridge-meross](https://github.com/donavanbecker/homebridge-meross/blob/master/config.schema.json)
- [homebridge-mi-hygrothermograph](https://github.com/hannseman/homebridge-mi-hygrothermograph/blob/master/config.schema.json)
- [homebridge-mqttthing](https://github.com/arachnetech/homebridge-mqttthing/blob/master/config.schema.json)
- [homebridge-music](https://github.com/ebaauw/homebridge-music/blob/master/config.schema.json)
- [homebridge-mysmartblinds-bridge](https://github.com/apexad/homebridge-mysmartblinds-bridge/blob/master/config.schema.json)
- [homebridge-neato](https://github.com/naofireblade/homebridge-neato/blob/master/config.schema.json)
- [homebridge-nest](https://github.com/chrisjshull/homebridge-nest/blob/master/config.schema.json)
- [homebridge-onkyo](https://github.com/ToddGreenfield/homebridge-onkyo/blob/master/config.schema.json)
- [homebridge-openwebif-tv](https://github.com/grzegorz914/homebridge-openwebif-tv/blob/master/config.schema.json)
- [homebridge-otgw](https://github.com/ebaauw/homebridge-otgw/blob/master/config.schema.json)
- [homebridge-p1](https://github.com/ebaauw/homebridge-p1/blob/master/config.schema.json)
- [homebridge-pihole](https://github.com/arendruni/homebridge-pihole/blob/master/config.schema.json)
- [homebridge-platform-maxcube](https://github.com/normen/homebridge-platform-maxcube/blob/master/config.schema.json)
- [homebridge-platform-wemo](https://github.com/rudders/homebridge-platform-wemo/blob/master/config.schema.json)
- [homebridge-ring](https://github.com/dgreif/ring/blob/master/homebridge/config.schema.json)
- [homebridge-rpi](https://github.com/ebaauw/homebridge-rpi/blob/master/config.schema.json)
- [homebridge-sengled](https://github.com/j796160836/homebridge-sengled/blob/master/config.schema.json)
- [homebridge-smartglass](https://github.com/unknownskl/homebridge-smartglass/blob/master/config.schema.json)
- [homebridge-smartthings-v2](https://github.com/tonesto7/homebridge-smartthings-v2/blob/master/config.schema.json)
- [homebridge-sonos](https://github.com/nfarina/homebridge-sonos/blob/master/config.schema.json)
- [homebridge-sunricher-wifi](https://github.com/break-pointer/homebridge-sunricher-wifi/blob/master/config.schema.json)
- [homebridge-tesla](https://github.com/nfarina/homebridge-tesla/blob/master/config.schema.json)
- [homebridge-tion](https://github.com/break-pointer/homebridge-tion/blob/master/config.schema.json)
- [homebridge-tydom](https://github.com/mgcrea/homebridge-tydom/blob/master/config.schema.json)
- [homebridge-ueboom](https://github.com/alessandroaime/homebridge-ueboom/blob/master/config.schema.json)
- [homebridge-unifi-occupancy-sensor](https://github.com/oznu/homebridge-unifi-occupancy-sensor/blob/master/config.schema.json)
- [homebridge-videodoorbell](https://github.com/Samfox2/homebridge-videodoorbell/blob/master/config.schema.json)
- [homebridge-webos-tv](https://github.com/merdok/homebridge-webos-tv/blob/master/config.schema.json)
- [homebridge-weather-plus](https://github.com/naofireblade/homebridge-weather-plus/blob/master/config.schema.json)
- [homebridge-ws](https://github.com/ebaauw/homebridge-ws/blob/master/config.schema.json)
- [homebridge-xbox-tv](https://github.com/grzegorz914/homebridge-xbox-tv/blob/master/config.schema.json)
- [homebridge-yalesmarthomealarm](https://github.com/jak1502/homebridge-yalesmarthomealarm/blob/master/config.schema.json)
- [homebridge-zigbee](https://github.com/itsmepetrov/homebridge-zigbee/blob/master/config.schema.json)
- [homebridge-zp](https://github.com/ebaauw/homebridge-zp/blob/master/config.schema.json)

[homebridge-zp](https://github.com/ebaauw/homebridge-zp/blob/master/config.schema.json) screenshot (dark mode theme):

![image](https://user-images.githubusercontent.com/3979615/63856581-54dd6500-c9e5-11e9-8b6f-41790726d3f9.png)

[homebridge-config-ui-x](https://github.com/oznu/homebridge-config-ui-x/blob/master/config.schema.json) screenshot:

![image](https://user-images.githubusercontent.com/3979615/63856715-9b32c400-c9e5-11e9-919c-0b82355e3b92.png)

[homebridge-alexa](https://github.com/NorthernMan54/homebridge-alexa/blob/master/config.schema.json) screenshot:

![image](https://user-images.githubusercontent.com/3979615/63856789-cfa68000-c9e5-11e9-91ef-b9e1c9e26fe4.png)
