# Cameras

A camera is not built from services and characteristics like other HAP accessories. Instead you attach a **controller** to the accessory, and the controller creates the services it needs and calls back into your code when HomeKit wants a snapshot or a live stream.

Start from the [camera plugin template](https://github.com/homebridge/homebridge-plugin-camera-template) — it is a complete working plugin with an FFmpeg streaming delegate, and is far easier to adapt than to rebuild.

Two things about cameras catch people out before any code is written:

- **A camera must be published as an [external accessory](api/hap-platform-methods#apipublishexternalaccessories).** It cannot go through the Homebridge bridge, so the user pairs it separately using the code printed in the log.
- **Streaming is your plugin's job.** HomeKit only tells you where to send video and how it wants it encoded. Getting the camera's feed into that shape is usually FFmpeg's work, and that is where most of the effort goes.

## Setting up the controller

The controller is created with the streaming options your camera supports, plus the delegate that does the work, then attached to the accessory:

```js
const cameraController = new this.api.hap.CameraController({
  cameraStreamCount: 2, // how many streams can run at once
  delegate: myStreamingDelegate,
  streamingOptions: {
    supportedCryptoSuites: [this.api.hap.SRTPCryptoSuites.AES_CM_128_HMAC_SHA1_80],
    video: {
      codec: {
        profiles: [this.api.hap.H264Profile.BASELINE, this.api.hap.H264Profile.MAIN, this.api.hap.H264Profile.HIGH],
        levels: [this.api.hap.H264Level.LEVEL3_1, this.api.hap.H264Level.LEVEL3_2, this.api.hap.H264Level.LEVEL4_0],
      },
      resolutions: [
        [1920, 1080, 30], // width, height, framerate
        [1280, 720, 30],
        [640, 360, 30],
        [320, 240, 15], // required by the Apple Watch
      ],
    },
  },
})

accessory.configureController(cameraController)
```

Notes on the options:

- **`cameraStreamCount`** is how many simultaneous streams the camera supports. The HAP specification asks for at least 2 on a non-Secure-Video camera, though 1 works. A HomeKit Secure Video camera exposes only 1.
- **Resolutions** are `[width, height, framerate]`. HomeKit picks one from the list, so only advertise what the camera can actually produce. Include **320x240 at 15fps** — the Apple Watch requires it, and leaving it out means the stream fails there while working everywhere else.
- **Audio is optional.** Leave the `audio` block out and HAP-NodeJS advertises a placeholder codec so video still works. Declare it only if you really stream audio — doing so also adds the Microphone service and its volume control. The Apple Watch wants OPUS at 16kHz.
- **`supportedCryptoSuites`** should be `AES_CM_128_HMAC_SHA1_80` in practice. The `NONE` suite exists for packet capture during debugging and is not accepted by iOS.

## The streaming delegate

The delegate is an object with three methods. HomeKit calls them; your code answers.

### handleSnapshotRequest

> handleSnapshotRequest(request: SnapshotRequest, callback: SnapshotRequestCallback): void

Return a single JPEG image. The request carries the `width` and `height` HomeKit wants.

```js
class MyStreamingDelegate {
  async handleSnapshotRequest(request, callback) {
    try {
      const jpeg = await this.grabStillImage(request.width, request.height)
      callback(undefined, jpeg)
    } catch (err) {
      callback(err)
    }
  }
}
```

This is called far more often than the stream is — every time a camera tile is shown — so it needs to be quick. Serving a recent cached image and refreshing it in the background gives a much better result than starting FFmpeg for every request. Always call the callback, including on failure, or the tile hangs.

### prepareStream

> prepareStream(request: PrepareStreamRequest, callback: PrepareStreamCallback): void

HomeKit is about to start a stream and is telling you where to send it. The request contains the target address, the ports for video and audio, and the SRTP keys and salts for each.

Your job is to reserve the ports you will send _from_ and answer with them, along with an SSRC for each stream and your own SRTP key. Save the request's details against `request.sessionID` — you will need them when the stream actually starts.

### handleStreamRequest

> handleStreamRequest(request: StreamingRequest, callback: StreamRequestCallback): void

Called with a `request.type` of:

- **`start`** — begin sending. The request carries the negotiated `video` settings: resolution, framerate, H.264 profile and level, payload type, SSRC, `max_bit_rate` and the RTCP interval. Feed these to FFmpeg so the encode matches what HomeKit expects.
- **`reconfigure`** — HomeKit wants different settings, usually because the network changed. Restart the encoder with the new values.
- **`stop`** — the user closed the view. Kill the FFmpeg process and clean the session up.

Call the callback in every case. A missed `stop` leaves an FFmpeg process running for as long as Homebridge does.

Sessions are identified by `sessionID` throughout, and several can be live at once — track them in a map rather than in single fields on the delegate.

## Motion and occupancy sensors

Rather than adding sensor services yourself, let the controller do it, so they are linked to the camera correctly:

```js
const cameraController = new this.api.hap.CameraController({
  // ...
  sensors: {
    motion: true,
    occupancy: false,
  },
})
```

Trigger motion through the service the controller created:

```js
cameraController.motionService
  .updateCharacteristic(this.api.hap.Characteristic.MotionDetected, true)
```

Declaring the motion sensor here also matters for recording: it is what enables motion as a HomeKit Secure Video event trigger.

## Doorbells

A doorbell is a camera with a button, so use `DoorbellController` in place of `CameraController` — it takes the same options and adds the doorbell service:

```js
const doorbellController = new this.api.hap.DoorbellController({
  cameraStreamCount: 2,
  delegate: myStreamingDelegate,
  streamingOptions: { /* as above */ },
})

accessory.configureController(doorbellController)
```

When someone presses the button:

```js
doorbellController.ringDoorbell()
```

Give the accessory the `VIDEO_DOORBELL` category so it pairs with the right icon. A doorbell also enables the doorbell event trigger for Secure Video recordings.

## HomeKit Secure Video

Secure Video lets HomeKit record clips to iCloud when an event fires. Add a `recording` block to the controller options, with its own delegate:

```js
const cameraController = new this.api.hap.CameraController({
  // ...
  recording: {
    options: {
      prebufferLength: 4000,
      mediaContainerConfiguration: { /* fragment length and type */ },
      // video and audio codec options
    },
    delegate: myRecordingDelegate,
  },
  sensors: { motion: true },
})
```

`prebufferLength` is the number of milliseconds of video kept before the trigger, so a clip includes the moment leading up to the event. It must be at least 4000, and 4000–8000 is the sensible range. Your plugin has to be continuously buffering to satisfy this — Secure Video is not something that can be bolted on to a camera you only connect to on demand.

The recording delegate provides:

- **`updateRecordingActive(active)`** — the user turned recording on or off; start or stop your prebuffer accordingly.
- **`updateRecordingConfiguration(configuration)`** — the negotiated resolution, bitrate and fragment length. Encode to match.
- **`handleRecordingStreamRequest(streamId)`** — an async generator that yields `RecordingPacket` objects, each with a `data` buffer and an `isLast` flag. Set `isLast` on the final packet to close the stream cleanly.
- **`closeRecordingStream(streamId, reason)`** — stop and tidy up.

Event triggers are worked out for you: motion is enabled when a motion sensor is configured, and doorbell when the `DoorbellController` is used.

## Further reading

The camera APIs have more surface than this page covers — RTP proxying, custom operating-mode characteristics and the data stream transport. The generated [HAP-NodeJS reference](https://developers.homebridge.io/HAP-NodeJS/modules.html) documents every type, and the [camera plugin template](https://github.com/homebridge/homebridge-plugin-camera-template) shows a working delegate end to end.
