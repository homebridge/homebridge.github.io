# LOG Reference

### Logging Levels

> this.log

Basic logging 

> this.log.info

Basic logging

```
  this.log.info('Setting switch state to:', value);
```

> this.log.success

Messages are highlighted in green
( Since Homebridge 1.8.0 )

```
  this.log.success(`Discovery finished, found ${this.receiverCount} Yamaha AVR's and creating ${this.receivers.length} HomeKit accessories.`);
```
> this.log.warn

Messages are highlighted in yellow, and with the console error logger

```
  this.log.warn(`Zone controller for ${zoneName} already exists`);
```
> this.log.error

Messages are highlighted in red, and with the console error logger

```
  this.log.error(`Error getting system config for ${service.name}:`, error);
```
> this.log.debug

Messages are highlighted in gray<br>
Messages with DEBUG level are only displayed if explicitly enabled. Debug level logging is enabled with the homebridge command line options -D or --debug.

```
  this.log.debug(`Got volume percent of ${v}%, ${p}%`, volume, this.zone);
```