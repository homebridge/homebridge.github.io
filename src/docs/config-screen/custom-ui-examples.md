# Custom UI Examples

Working examples and real plugins to learn from when building a [custom user interface](/#/config-screen/custom-ui).

## Official Examples

- [Basic Example](https://github.com/homebridge/plugin-ui-utils/blob/master/examples/basic-ui-server) - demos a minimal custom user interface, interacting with server side scripts, updating the plugin config, and using toast notifications.
- [Push Events](https://github.com/homebridge/plugin-ui-utils/blob/master/examples/push-events) - demos how to send push events from the server, and listen for them in the custom user interface.

A full list of plugins that have implemented the custom user interface can be found [here](https://www.npmjs.com/package/@homebridge/plugin-ui-utils?activeTab=dependents).

## Notable Plugins

### homebridge-mercedesme

The [homebridge-mercedesme](https://github.com/SeydX/homebridge-mercedesme) plugin by [@SeydX](https://github.com/SeydX) allows users to pair their vehicle using a custom user interface:

<p align="center">
<img src="https://raw.githubusercontent.com/SeydX/homebridge-mercedesme/beta/images/hb_mercedesme_ui.gif" width="900">
</p>

### homebridge-bravia-tvos

The [homebridge-bravia-tvos](https://github.com/SeydX/homebridge-bravia-tvos) plugin by [@SeydX](https://github.com/SeydX) allows users to pair and dynamically configure a user's TV using a custom user interface:

<p align="center">
<img src="https://user-images.githubusercontent.com/3979615/99958753-0a13ee00-2dde-11eb-95fb-69a896d37545.png" width="600">
</p>

### homebridge-electra-smart

The [homebridge-electra-smart](https://github.com/nitaybz/homebridge-electra-smart) plugin by [nitaybz](https://github.com/nitaybz) allows users to request a OTP and enter it in exchange for an authentication token:

<p align="center">
<img src="https://user-images.githubusercontent.com/3979615/99959242-be157900-2dde-11eb-8114-6394da2a2e14.png" width="600">
</p>

## Development

For hints and tips on how to develop your custom user interface, see [DEVELOPMENT.md](https://github.com/homebridge/plugin-ui-utils/blob/master/DEVELOPMENT.md).
