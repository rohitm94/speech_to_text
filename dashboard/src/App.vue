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
      <v-toolbar-title>ITCS 6114 - Text to Speech</v-toolbar-title>
    </v-toolbar>

    <v-content> 
      <v-container fluid fill-height grid-list-md text-xs-center>
        <v-layout row align-center justify-center>
          <v-flex xs6>
            <audio-recorder
              upload-url="YOUR_API_URL"
              :attempts="3"
              :headers="headers"
              :time="2"
              :start-record="callback"
              :stop-record="callback"
              :start-upload="callback"
              :successful-upload="callback"
              :failed-upload="callback"/>
          </v-flex>

          <v-flex xs6>
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
            <v-card raised>
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
      <span class="white--text">&copy; 2018 - UNCC ITCS 6114 Speech to Text team, except Saad</span>
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
    currentFilesTranscript: "Again, select a file first.."
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
          filename: item
        })
        .then(response => {
          console.log(response.data);
          this.generatedTranscript = response.data.transcript;
          this.currentFilesTranscript = this.transcripts[
            this.audioFiles.indexOf(item)
          ];
        });
    }
  }
};
</script>