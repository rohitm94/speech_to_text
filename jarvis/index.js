const fs = require('fs');
const speech = require('@google-cloud/speech');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const projectID = 'speech-to-text-1541457033718';
const keyFile = path.join(__dirname, 'Speech_to_text-bd8db80ceecf.json');

const client = new speech.SpeechClient({
  projectId: projectID,
  keyFilename: keyFile,
  credentials: require(keyFile),
});

const audioFolder = path.join(__dirname, 'audio');

function recordedRecognize(filename) {
  const config = {
    encoding: 'WAV',
    sampleRateHertz: 48000,
    languageCode: 'en-US',
    enableAutomaticPunctuation: true,
    // enableSpeakerDiarization: true,
    // diarizationSpeakerCount: 2,
  };
  const audio = {
    content: fs.readFileSync(path.join(audioFolder, 'recorded', filename)).toString('base64'),
  };

  const request = {
    config,
    audio,
  };
  let returnVal = {};
  // Detects speech in the audio file
  returnVal = client
    .recognize(request)
    .then((data) => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      //   console.log(`Transcription: ${transcription}`);
      //   console.log('Speaker Diarization:');
      const result = response.results[response.results.length - 1];
      const wordsInfo = result.alternatives[0].words;
      // Note: The transcript within each result is separate and sequential per result.
      // However, the words list within an alternative includes all the words
      // from all the results thus far. Thus, to get all the words with speaker
      // tags, you only have to take the words list from the last result:
      wordsInfo.forEach(a => console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`));
      return {
        transcript: transcription,
        wordsInfo,
      };
    })
    .catch((err) => {
      console.error('ERROR:', err);
      return {
        transcript: null,
        wordsInfo: null,
      };
    });

  return returnVal;
}

function testRecognize(filename) {
  const config = {
    encoding: 'FLAC',
    sampleRateHertz: 44100,
    languageCode: 'en-US',
    enableAutomaticPunctuation: true,
    // enableSpeakerDiarization: true,
    // diarizationSpeakerCount: 2,
  };
  const audio = {
    content: fs.readFileSync(path.join(audioFolder, filename)).toString('base64'),
  };

  const request = {
    config,
    audio,
  };
  let returnVal = {};
  // Detects speech in the audio file
  returnVal = client
    .recognize(request)
    .then((data) => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      //   console.log(`Transcription: ${transcription}`);
      //   console.log('Speaker Diarization:');
      const result = response.results[response.results.length - 1];
      const wordsInfo = result.alternatives[0].words;
      // Note: The transcript within each result is separate and sequential per result.
      // However, the words list within an alternative includes all the words
      // from all the results thus far. Thus, to get all the words with speaker
      // tags, you only have to take the words list from the last result:
      wordsInfo.forEach(a => console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`));
      return {
        transcript: transcription,
        wordsInfo,
      };
    })
    .catch((err) => {
      console.error('ERROR:', err);
      return {
        transcript: null,
        wordsInfo: null,
      };
    });

  return returnVal;
}


const app = express();
app.use(cors({
  origin: '*',
}));
app.use(bodyParser());
app.use(fileUpload());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/gettestfiles', (req, res) => {
  res.send({
    names: fs.readdirSync(audioFolder),
    transcripts: {
      'Test - 1.flac': 'This is speech to text testing. This is our project for this class.',
      'Test - 2.flac': 'We are going to sell this project eventually. For now please be patient.',
      'Test - 3.flac': 'We are building our interface for this project. This is just a test of the API call',
      'Test - 4.flac': 'Please give us a hundred for this project as we worked hard for it. Google API was used for this project.',
      'Test - 5.flac': 'Our group is hardworking and we do our work on time.',
    },
  });
});

app.get('/gettestfiles', (req, res) => {
  res.send({
    names: fs.readdirSync(path.join(audioFolder))
  });
});

app.get('/getrecordedfiles', (req, res) => {
  res.send({
    names: fs.readdirSync(path.join(audioFolder, 'recorded'))
  });
});

app.post('/gettranscripts', (req, res) => {
  console.log(`Recieved a request for ${req.body.filename}`);

  if (req.body.testMode) {
    testRecognize(req.body.filename).then((response) => {
      console.log(response);
      res.send({
        transcript: response.transcript,
        wordsInfo: response.wordsInfo,
      });
    });
  }
  else {
    recordedRecognize(req.body.filename).then((response) => {
      console.log(response);
      res.send({
        transcript: response.transcript,
        wordsInfo: response.wordsInfo,
      });
    });
  }
});

// app.get('audioFile', (req, res) => {
//   const filePath = path.join(audioFolder, req.body.filename);
//   res.download(filePath, req.body.filename, (err) => {
//     console.log("couldn't download..");
//     console.log(err);
//   });
// });

app.post('/upload', function (req, res) {
  console.log('I think I got a file!');
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let audioFile = req.files.audio;
  audioFile.name = audioFile.name + '.wav';
  // Use the mv() method to place the file somewhere on your server
  audioFile.mv(path.join(audioFolder, 'recorded', audioFile.name), function (err) {
    if (err)
      return res.status(500).send(err);

    console.log('File moved!')
    res.send('File uploaded!');
  });
});

app.listen(3000, () => console.log('JARVIS is now listening with his special transcribing pen ready...'));
