# LOG Reference

### Info

> log(message: string, ...parameters: any[])

Basic logging 

> log.info(message: string, ...parameters: any[])

Basic logging

```
  this.log.info('Setting switch state to:', value);
```

### Success

> log.success(message: string, ...parameters: any[])

Messages are highlighted in green
( Since Homebridge 1.8.0 )

```
  this.log.success(`Discovery finished, found ${this.receiverCount} Yamaha AVR's and creating ${this.receivers.length} HomeKit accessories.`);
```

### Warn

> log.warn(message: string, ...parameters: any[])

Messages are highlighted in yellow, and with the console error logger

```
  this.log.warn(`Zone controller for ${zoneName} already exists`);
```

### Error

> log.error(message: string, ...parameters: any[])

Messages are highlighted in red, and with the console error logger

```
  this.log.error(`Error getting system config for ${service.name}:`, error);
```

### Debug

> log.debug(message: string, ...parameters: any[])

Messages are highlighted in gray<br>
Messages with DEBUG level are only displayed if explicitly enabled. Debug level logging is enabled with the homebridge command line options -D or --debug.

```
  this.log.debug(`Got volume percent of ${v}%, ${p}%`, volume, this.zone);
```