<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >

      <v-list two-line>
        <v-list-tile @click="">
          <v-list-tile-content>
            <h2>Home</h2>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-content>
            <h2>Not home</h2>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>

    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>ITCS 6112 - Speech to Text - Table 6</v-toolbar-title>
    </v-toolbar>

    <v-content> 
      <v-container fluid fill-height grid-list-md text-xs-center>
        <v-layout row align-center justify-center>
          <v-flex xs6>
            <audio-recorder
              upload-url="http://localhost:3000/upload"
              axios="axios"
              :headers='{ "Access-Control-Allow-Origin": "*" }'
              :time="1"
              :successful-upload="successfulUpload"/>
              <!-- :start-record="callback"
              :stop-record="callback"
              :start-upload="callback"

              :failed-upload="callback"/> -->
          </v-flex>


          
          <v-flex xs6>            
          <v-checkbox
            label='Test Mode:'
            v-model="testMode"
            @change="onNewTestMode"
          ></v-checkbox>


          <v-select
            :items="audioFiles"
            label="Select an audio file here"
            @change="onNewSelection"
          ></v-select>

          

            <v-card raised>
              <v-card-title primary-title>
                <h2>Generated Transcript</h2>
              </v-card-title>
              <v-card-text>
                 {{ generatedTranscript }} 
              </v-card-text>
            </v-card>
            <br>
            <v-card v-if="testMode" raised>
              <v-card-title primary-title>
                <h2>Actual Transcript</h2>
              </v-card-title>
              <v-card-text>
                 {{ currentFilesTranscript }}
                </v-card-text>
            </v-card>
          </v-flex>

        </v-layout>
      </v-container>
    </v-content>

    <v-footer color="indigo" app>
      <span class="white--text"> &copy; 2018 - UNCC ITCS 6112 Speech to Text team</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    audioFiles: ["loading..."],
    transcripts: ["loading..."],
    generatedTranscript: "Select a file first..",
    currentFilesTranscript: "Again, select a file first..",
    testMode: true
  }),

  props: {
    source: String
  },
  created: function() {
    axios
      .get("http://localhost:3000/gettestfiles", {
        headers: { "Access-Control-Allow-Origin": "*" }
      })
      .then(response => {
        console.log(response.data);
        this.audioFiles = response.data.names;
        this.transcripts = response.data.transcripts;
      })
      .catch(err => {
        console.log(err);
        console.log("error there");
      });
  },
  methods: {
    onNewSelection(item) {
      this.generatedTranscript = this.currentFilesTranscript = "Loading ...";
      axios
        .post("http://localhost:3000/gettranscripts", {
          headers: { "Access-Control-Allow-Origin": "*" },
          filename: item,
          testMode: this.testMode
        })
        .then(response => {
          console.log(response.data);
          this.generatedTranscript = response.data.transcript;
          if (this.testMode)
            this.currentFilesTranscript = this.transcripts[item];
        });
    },
    successfulUpload() {
      this.testMode = false;
      onNewTestMode(this.testMode);
    },
    onNewTestMode(value) {
      if (this.testMode == true) {
        axios
          .get("http://localhost:3000/gettestfiles", {
            headers: { "Access-Control-Allow-Origin": "*" }
          })
          .then(response => {
            console.log(response.data);
            this.audioFiles = response.data.names;
            this.generatedTranscript = undefined;
            this.transcripts = response.data.transcripts;
          })
          .catch(err => {
            console.log(err);
            console.log("error there");
            this.audioFiles = undefined;
            this.generatedTranscript = undefined;
            this.transcripts = undefined;
          });
      } else {
        axios
          .get("http://localhost:3000/getrecordedfiles", {
            headers: { "Access-Control-Allow-Origin": "*" }
          })
          .then(response => {
            console.log(response.data);
            this.audioFiles = response.data.names;
            this.generatedTranscript = undefined;
            this.transcripts = undefined;
          })
          .catch(err => {
            console.log(err);
            console.log("error there");
            this.generatedTranscript = undefined;
            this.audioFiles = undefined;
            this.transcripts = undefined;
          });
      }
    }
  }
};
</script>