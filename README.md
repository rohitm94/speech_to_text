# ITCS 6114 - Speech to Text
Audio recorder for [Node.js](https://nodejs.org/), delivers a 16-bit signed-integer linear pulse modulation WAV stream. Based of [Gilles De Mey](https://github.com/gillesdemey)'s [node-record-lpcm16](https://github.com/gillesdemey/node-record-lpcm16).

## Installation
First, ensure you have [node.js](https://nodejs.org/en/) installed. Developed is done in v10.9, although there shouldn't be any issues if you run it on any other version.

Install the `yarn` package manager via `npm`. `npm` should be on your path if you correctly installed node.

```
npm install yarn
```

And then use yarn to install all node dependencies using - 

```
yarn install
```

## Usage

This software consists of two servers, namely `dashboard` and `jarvis`. `jarvis` handles all API calls to node  

### Constructor
```javascript
// Import module.
const AudioRecorder = require('node-audiorecorder');

// Options is an optional parameter for the constructor call.
// If an option is not given the default value, as seen below, will be used.
const options = {
  program: `rec`,     // Which program to use, either `arecord`, `rec`, and `sox`.
  device: null,       // Recording device to use.
  
  bits: 16,           // Sample size. (only for `rec` and `sox`)
  channels: 1,        // Channel count.
  encoding: `signed-integer`,  // Encoding type. (only for `rec` and `sox`)
  rate: 16000,        // Sample rate.
  type: `wav`,        // Format type.
  
  // Following options only when program is `rec` or `sox`.
  silence: 2,         // Duration of silence in seconds before it stops recording.
  thresholdStart: 0.5,  // Silence threshold to start recording, overrides threshold.
  thresholdStop: 0.5,   // Silence threshold to stop recording, overrides threshold.
};
// Optional parameter intended for debugging.
// The object has to implement a log and warn function.
const logger = console;

// Create an instance.
let audioRecorder = new AudioRecorder(options, logger);
```

> 'arecord' might not work on all operating systems. If you can't capture any sound with 'arecord', try to change device to 'arecord -l'.

### Methods
```javascript
// Creates and starts the recording process.
audioRecorder.Start();
// Stops and removes the recording process.
audioRecorder.Stop();
// Returns the stream of the recording process.
audioRecorder.Stream();
```

### Examples

See the [examples directory](https://github.com/RedKenrok/node-audiorecorder/tree/master/examples) for example usage.

> For another example see the [node-hotworddetector](https://github.com/RedKenrok/node-hotworddetector) module, or [Electron-VoiceInterfaceBoilerplate](https://github.com/RedKenrok/Electron-VoiceInterfaceBoilerplate)'s input.js.

## Troubleshooting

### Windows continues recording
If you have issues with continues recording on Windows 10 with SoX 14.4.2 or later, install version [14.4.1](https://sourceforge.net/projects/sox/files/sox/14.4.1/) instead.

## License

[MIT license](https://github.com/redkenrok/node-audiorecorder/blob/master/LICENSE)