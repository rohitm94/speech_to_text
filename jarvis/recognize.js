// Imports the Google Cloud client library
const fs = require('fs');
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient({
  projectId: 'speech-to-text-1541457033718',
  keyFilename: 'C:\\Users\\dhruv\\Documents\\Software System Design and Implementation\\audio_text\\Speech_to_text-bd8db80ceecf.json',
  credentials: require('C:\\Users\\dhruv\\Documents\\Software System Design and Implementation\\audio_text\\Speech_to_text-bd8db80ceecf.json'),
});

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const filename = 'C:\\Users\\dhruv\\Documents\\Software System Design and Implementation\\audio_text\\audio\\test.flac';
const encoding = 'FLAC';
const sampleRateHertz = 44100;
const languageCode = 'en-US';

const config = {
  encoding,
  sampleRateHertz,
  languageCode,
};
const audio = {
  content: fs.readFileSync(filename).toString('base64'),
};

const request = {
  config,
  audio,
};

// Detects speech in the audio file
client
  .recognize(request)
  .then((data) => {
    const response = data[0];
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log('Transcription: ', transcription);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
