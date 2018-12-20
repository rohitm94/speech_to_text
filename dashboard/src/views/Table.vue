<template>
  <v-container fluid fill-height grid-list-md text-xs-center>
    <v-layout row align-top justify-center fill-height wrap>
      <v-flex xs12>
        <h1>Table {{ $route.params.tableNo }}</h1>
      </v-flex>
      <v-flex pa-3>
        <v-text-field
          solo
          placeholder="Name for current recording... (optional)"
          :value="currentRecording.name"
          @change="updateCurrentRecordingName"
        />
        <v-text-field
          solo
          placeholder="Description for current recording... (optional)"
          multi-line
          :value="currentRecording.desc"
          @change="updateCurrentRecordingDesc"
        />
        <v-select
          :items="speakerNumberList"
          label="No of Speakers"
          :value="currentRecording.noOfSpeakers"
          @change="updateNoOfSpeakers"
        ></v-select>
        <audio-recorder
          upload-url="http://localhost:3000/upload"
          axios="axios"
          :headers="{ 'Access-Control-Allow-Origin': '*' }"
          :time="20"
          :successful-upload="successfulUpload"
          :start-record="startRecording"
          :stop-record="stopRecording"
          :start-upload="startUploading"
        />
      </v-flex>

      <v-snackbar
        v-model="toastShow"
        :color="toastColor"
        :timeout="toastTimeOut"
        bottom
        right
      >{{ toastMessage }}</v-snackbar>

      <v-flex pa-3>
        <v-card raised height="100%">
          <v-card-title primary-title>
            <h2>Past Recordings</h2>
          </v-card-title>
          <v-card-text>
            <v-data-table :headers="recordTableHeaders" :items="currentRecords" item-key="name">
              <template slot="items" slot-scope="props">
                <td class="text-xs-left">{{props.item.name}}</td>
                <td>{{props.item.time}}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      toastShow: false,
      toastMessage: undefined,
      toastTimeOut: 1500,
      toastColor: "#212121",
      recordTableHeaders: [
        {
          text: "Name",
          value: "name",
          sortable: false
        },
        {
          text: "Time created",
          align: "center",
          value: "time"
        }
      ]
    };
  },
  created: function() {
    this.$store.commit("updateTabRoutes", {
      recordRoute: "/table/" + this.$route.params.tableNo.toString(),
      analyzeRoute: "/analyze/" + this.$route.params.tableNo.toString()
    });
    this.$store.dispatch("initRecords");
  },
  computed: {
    primaryColor: function() {
      return this.$vuetify.theme.primary;
    },
    ...mapState(["speakerNumberList", "currentRecording", "currentRecords"])
  },
  methods: {
    startRecording: function() {
      this.$vuetify.theme.primary = "FF6B64";
    },
    stopRecording: function() {
      this.$vuetify.theme.primary = "#00999b";
    },
    showToast: function(message, time = 1500, color = "#212121") {
      this.toastMessage = message;
      this.toastTimeOut = time;
      this.toastColor = color;
      this.toastShow = true;
    },
    startUploading: function() {
      console.log("starting upload");
      this.showToast("Uploading to server...", 3000);
    },
    successfulUpload: function() {
      console.log("done");
      this.showToast("Uploaded to server.", 2000, this.$vuetify.theme.success);
      if (this.$store.state.currentRecording.name != "") {
        console.log("Attempting to upload details...");
        this.$jarvis
          .post("/uploadDetails", {
            name: this.$store.state.currentRecording.name,
            desc: this.$store.state.currentRecording.desc,
            speakerCount: this.$store.state.currentRecording.noOfSpeakers,
            tableNo: this.$route.params.tableNo
          })
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    failedUpload: function() {
      console.log("failed");
      this.showToast(
        "Failed to upload to server.",
        2000,
        this.$vuetify.theme.error
      );
    },
    ...mapMutations([
      "updateNoOfSpeakers",
      "updateCurrentRecordingName",
      "updateCurrentRecordingDesc"
    ])
  }
};
</script>

