import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const jarvis = axios.create({
  baseURL: "http://localhost:3000/",
  headers: { "Access-Control-Allow-Origin": "*" }
});

export default new Vuex.Store({
  state: {
    speakerNumberList: [1, 2, 3, 4],
    currentRecording: {
      name: undefined,
      desc: undefined,
      noOfSpeakers: 1
    },
    currentTableNo: 2,
    currentRecordRoute: "/table/2",
    currentAnalyzeRoute: "/analyze/2",
    tables: [1],
    currentRecords: undefined
  },
  mutations: {
    updateNoOfSpeakers: (state, newValue) => {
      console.log("updated noOfSpeakers in store to " + newValue);
      state.currentRecording.noOfSpeakers = newValue;
    },
    updateCurrentRecordingName: (state, newValue) => {
      console.log("updated name in store to " + newValue);
      state.currentRecording.name = newValue;
    },
    updateCurrentRecordingDesc: (state, newValue) => {
      console.log("updated desc in store to " + newValue);
      state.currentRecording.desc = newValue;
    },
    updateTabRoutes: (state, { recordRoute, analyzeRoute }) => {
      if (recordRoute) {
        console.log("updated currentRecordRoute to " + recordRoute);
        state.currentRecordRoute = recordRoute;
        state.currentTableNo = parseInt(recordRoute.replace(/^\D+/g, ""));
      }
      if (analyzeRoute) {
        console.log("updated currentAnalyzeRoute to " + analyzeRoute);
        state.currentAnalyzeRoute = analyzeRoute;
        state.currentTableNo = parseInt(recordRoute.replace(/^\D+/g, ""));
      }
    },
    initStore: (state, { tables }) => {
      console.log("initializing store with " + tables);
      state.tables = tables;
    },
    initRecords: (state, records) => {
      console.log("initializing records with " + records);
      state.currentRecords = records;
    }
  },
  actions: {
    initStore: context => {
      jarvis
        .get("/init")
        .then(response => {
          context.commit("initStore", response.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    initRecords: context => {
      jarvis
        .post("/records", {
          tableNo: context.state.currentTableNo
        })
        .then(response => {
          context.commit("initRecords", response.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
});
