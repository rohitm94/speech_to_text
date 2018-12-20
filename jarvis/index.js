const fs = require('fs');
const speech = require('@google-cloud/speech');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const moveFile = require('move-file');
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
var moment = require('moment');
const adapter = new FileAsync('db.json')
var nlp = require('compromise')


let https = require('https');
let azure = {
    uri: 'westcentralus.api.cognitive.microsoft.com',
    path: '/text/analytics/v2.0/languages',
    accessKey: '64da3e0e8cc74d088d9fcfd1940f8ae2'
};


let filesQueue = [];

const projectID = 'speech-to-text-1541457033718';
const keyFile = path.join(__dirname, 'Speech_to_text-bd8db80ceecf.json');

const client = new speech.SpeechClient({
    projectId: projectID,
    keyFilename: keyFile,
    credentials: require(keyFile),
});

const audioFolder = path.join(__dirname, 'audio');

const app = express();
app.use(cors({
    origin: '*',
}));
app.use(bodyParser());
app.use(fileUpload());

low(adapter).then(db => {
    db.defaults({ audios: [], tables: [1, 2, 3, 4, 5, 6, 7, 8] }).write()

    function transcriptize(audioName) {
        let audio = db.get('audios')
            .find({ name: audioName })
            .value();
        // .then(value => {
        //     return value;
        // })
        // .catch(err => {
        //     console.log(err);
        // });

        const request = {
            config: audio['audioConfig'],
            audio: {
                content: fs.readFileSync(audio['path']).toString('base64')
            }
        }

        client
            .recognize(request)
            .then((data) => {
                const response = data[0];
                const transcription = response.results
                    .map(result => result.alternatives[0].transcript)
                    .join('\n');
                console.log(`Transcription: ${transcription}`);
                console.log('Speaker Diarization:');

                const result = response.results[response.results.length - 1];
                const wordsInfo = result.alternatives[0].words;

                // Note: The transcript within each result is separate and sequential per result.
                // However, the words list within an alternative includes all the words
                // from all the results thus far. Thus, to get all the words with speaker
                // tags, you only have to take the words list from the last result:
                wordsInfo.forEach(a => console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`));

                doc = nlp(transcription);

                let analysis = {
                    topics: doc.topics().data(),
                    tags: doc.out('tags'),
                    peoples: doc.people().out('array'),
                    organizations: doc.organizations().out('array'),
                    places: doc.places().out('array'),
                    questions: doc.questions().out('array'),
                    acronyms: doc.acronyms().out('array'),
                    statements: doc.statements().out('array'),
                    urls: doc.urls().out('array'),
                    dates: doc.dates().out('array'),
                    noun: doc.nouns().out('array'),
                }

                console.log(JSON.stringify(analysis))

                db.get('audios')
                    .find({ name: audioName })
                    .assign({
                        transcript: transcription,
                        wordsInfo: wordsInfo,
                        analysis: {
                            ...analysis
                        }
                    })
                    .write();

                return db.get('audios')
                    .find({ name: audioName }).value()


            })
            .catch((err) => {
                console.error('ERROR:', err);
                return undefined
            });
    }

    app.post('/records', (req, res) => {
        if (req.body.tableNo) {
            console.log('finding records for ' + req.body.tableNo)
            let records = db.get('audios').filter({ tableNo: req.body.tableNo.toString() }).value();

            res.status(200).send([...records])
        } else {
            console.log('Got a request for /records without any tableNo');
        }
    })

    app.post('/upload', function (req, res) {
        console.log('I think I got a file!');
        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
        }

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let audioFile = req.files.audio;
        audioFile.name = audioFile.name + '.wav';
        // Use the mv() method to place the file somewhere on your server
        audioFile.mv(path.join(audioFolder, 'temp', audioFile.name), function (err) {
            if (err)
                return res.status(500).send(err);

            filesQueue.push(audioFile.name)
            console.log('File moved! ' + audioFile.name)
            res.status(200).send('Success!');
        });
    });

    app.post('/uploadDetails', function (req, res) {
        console.log('Got details for a file!');

        (async () => {
            try {
                await moveFile(
                    path.join(audioFolder, 'temp', filesQueue.pop()),
                    path.join(audioFolder, req.body.tableNo, req.body.name + '.wav'),
                    { overwrite: true }
                );
            }
            catch (e) {
                console.log(e)
            }

            let newDoc = {
                ...req.body,
                time: moment().format("h:mm a, MMMM Do YY"),
                analysis: undefined,
                transcript: undefined,
                wordsInfo: undefined,
                audioConfig: {
                    encoding: 'WAV',
                    sampleRateHertz: 48000,
                    languageCode: 'en-US',
                    enableAutomaticPunctuation: true,
                    enableSpeakerDiarization: true,
                    diarizationSpeakerCount: req.body.speakerCount,
                },
                path: path.join(audioFolder, req.body.tableNo, req.body.name + '.wav')
            };

            let findResult = db.get('audios')
                .find({ name: req.body.name })
                .value();

            if (findResult) {
                db.get('audios')
                    .find({ name: req.body.name })
                    .assign({ ...newDoc })
                    .write();

                transcriptize(newDoc['name'])
            }
            else {
                db.get('audios')
                    .push(newDoc)
                    .write()

                transcriptize(newDoc['name'])
            }

            // db.saveSync('db.json');
            console.log('File moved! ' + req.body.tableNo + '/' + req.body.name);

        })();
    })

    app.get('/init', (req, res) => {
        console.log('Got request for /init!')
        res.send({
            tables: db.getState()['tables']
        })
    })

    return db.write()
}).then(() => {
    app.listen(3000, () => console.log('JARVIS is now listening with his special transcribing pen ready...'));
})