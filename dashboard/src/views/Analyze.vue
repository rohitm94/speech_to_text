<template>
  <v-container grid-list-md>
    <v-layout align-start justify-center wrap>
      <v-flex xs12>
        <h1 class="text-xs-center">Table {{ $route.params.tableNo }}</h1>
      </v-flex>
      <v-flex xs12>
        <v-select :items="recordNames" label="Select an audio recording" @change="updateSelection"></v-select>
      </v-flex>
      <v-flex v-if="selectedRecord.length > 0" v-for="record in selectedRecord">
        <v-layout mb-1>
          <v-flex grow>
            <h2 class="text-xs-left display-1 font-weight-medium">{{record.name}}</h2>
          </v-flex>
          <v-flex shrink class="grey--text font-weight-light headline">{{record.time}}</v-flex>
        </v-layout>
        <v-flex xs12 class="font-weight-light font-italic subheading" mb-1>{{record.desc}}</v-flex>
        <v-flex>
          <v-textarea solo v-model="record.transcript" auto-grow label=" "></v-textarea>
        </v-flex>
        <v-flex x12>
          <v-tabs>
            <v-tab v-if="nlp(record.transcript).topics().data().length > 0">Topics</v-tab>
            <v-tab v-if="nlp(record.transcript).people().data().length > 0">People</v-tab>
            <v-tab v-if="nlp(record.transcript).organizations().data().length > 0">Organizations</v-tab>
            <v-tab v-if="nlp(record.transcript).places().data().length > 0">Places</v-tab>
            <v-tab v-if="nlp(record.transcript).questions().data().length > 0">Questions</v-tab>
            <v-tab v-if="nlp(record.transcript).statements().data().length > 0">Statements</v-tab>
            <v-tab v-if="nlp(record.transcript).acronyms().data().length > 0">Acronyms</v-tab>
            <v-tab v-if="nlp(record.transcript).dates().data().length > 0">Dates</v-tab>
            <v-tab v-if="nlp(record.transcript).urls().data().length > 0">Urls</v-tab>

            <v-tab-item v-if="nlp(record.transcript).topics().data().length > 0">
              <v-card>
                <v-card-text v-for="row in nlp(record.transcript).topics().data()">
                  <v-layout ma-1>
                    <v-flex class="text-xs-left headline font-weight-medium" grow>{{row.text}}</v-flex>
                    <v-flex shrink class="grey--text font-weight-light subheading">{{row.normal}}</v-flex>
                  </v-layout>
                  <div v-if="Object.keys(row).length > 2">
                    <ul>
                      <li v-for="key in Object.keys(row)" v-if="row[key]">{{key}}: {{row[key]}}</li>
                    </ul>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item v-if="nlp(record.transcript).people().data().length > 0">
              <v-card>
                <v-card-text v-for="row in nlp(record.transcript).people().data()">
                  <v-layout ma-1>
                    <v-flex class="text-xs-left headline font-weight-medium" grow>{{row.text}}</v-flex>
                    <v-flex shrink class="grey--text font-weight-light subheading">{{row.normal}}</v-flex>
                  </v-layout>
                  <div v-if="Object.keys(row).length > 2">
                    <ul>
                      <li
                        v-for="key in Object.keys(row)"
                        v-if="row[key] && row[key] != []"
                      >{{key}}: {{row[key]}}</li>
                    </ul>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item v-if="nlp(record.transcript).organizations().data().length > 0">
              <v-card>
                <v-card-text v-for="row in nlp(record.transcript).organizations().data()">
                  <v-layout ma-1>
                    <v-flex class="text-xs-left headline font-weight-medium" grow>{{row.text}}</v-flex>
                    <v-flex shrink class="grey--text font-weight-light subheading">{{row.normal}}</v-flex>
                  </v-layout>
                  <div v-if="Object.keys(row).length > 2">
                    <ul>
                      <li v-for="key in Object.keys(row)">{{key}}: {{row[key]}}</li>
                    </ul>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item v-if="nlp(record.transcript).places().data().length > 0">
              <v-card>
                <v-card-text v-for="row in nlp(record.transcript).places().data()">
                  <v-layout ma-1>
                    <v-flex class="text-xs-left headline font-weight-medium" grow>{{row.text}}</v-flex>
                    <v-flex shrink class="grey--text font-weight-light subheading">{{row.normal}}</v-flex>
                  </v-layout>
                  <div v-if="Object.keys(row).length > 2">
                    <ul>
                      <li v-for="key in Object.keys(row)">{{key}}: {{row[key]}}</li>
                    </ul>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item v-if="nlp(record.transcript).questions().data().length > 0">
              <v-card>
                <v-card-text v-for="row in nlp(record.transcript).questions().data()">
                  <v-layout ma-1>
                    <v-flex class="text-xs-left subheading font-weight-medium" grow>{{row.text}}</v-flex>
                    <v-flex shrink class="grey--text font-weight-light body-2">{{row.normal}}</v-flex>
                  </v-layout>
                  <div v-if="Object.keys(row).length > 2">
                    <ul>
                      <li v-for="key in Object.keys(row)">{{key}}: {{row[key]}}</li>
                    </ul>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item v-if="nlp(record.transcript).statements().data().length > 0">
              <v-card>
                <v-card-text v-for="row in nlp(record.transcript).statements().data()">
                  <v-layout ma-1>
                    <v-flex class="text-xs-left subheading font-weight-medium" grow>{{row.text}}</v-flex>
                    <v-flex shrink class="grey--text font-weight-light body-2">{{row.normal}}</v-flex>
                  </v-layout>
                  <div v-if="Object.keys(row).length > 2">
                    <ul>
                      <li v-for="key in Object.keys(row)">{{key}}: {{row[key]}}</li>
                    </ul>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item v-if="nlp(record.transcript).acronyms().data().length > 0">
              <v-card>
                <v-card-text v-for="row in nlp(record.transcript).acronyms().data()">
                  <v-layout ma-1>
                    <v-flex class="text-xs-left headline font-weight-medium" grow>{{row.text}}</v-flex>
                    <v-flex shrink class="grey--text font-weight-light subheading">{{row.normal}}</v-flex>
                  </v-layout>
                  <div v-if="Object.keys(row).length > 2">
                    <ul>
                      <li v-for="key in Object.keys(row)">{{key}}: {{row[key]}}</li>
                    </ul>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item v-if="nlp(record.transcript).dates().data().length > 0">
              <v-card>
                <v-card-text v-for="row in nlp(record.transcript).dates().data()">
                  <v-layout ma-1>
                    <v-flex class="text-xs-left headline font-weight-medium" grow>{{row.text}}</v-flex>
                    <v-flex shrink class="grey--text font-weight-light subheading">{{row.normal}}</v-flex>
                  </v-layout>
                  <div v-if="Object.keys(row).length > 2">
                    <ul>
                      <li v-for="key in Object.keys(row)">{{key}}: {{row[key]}}</li>
                    </ul>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <v-tab-item v-if="nlp(record.transcript).urls().data().length > 0">
              <v-card>
                <v-card-text v-for="row in nlp(record.transcript).urls().data()">
                  <v-layout ma-1>
                    <v-flex class="text-xs-left subheading font-weight-medium" grow>{{row.text}}</v-flex>
                    <v-flex shrink class="grey--text font-weight-light body-2">{{row.normal}}</v-flex>
                  </v-layout>
                  <div v-if="Object.keys(row).length > 2">
                    <ul>
                      <li v-for="key in Object.keys(row)">{{key}}: {{row[key]}}</li>
                    </ul>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      selectedRecord: []
    };
  },
  created: function() {
    this.$store.commit("updateTabRoutes", {
      recordRoute: "/table/" + this.$route.params.tableNo.toString()
    });
    this.$store.dispatch("initRecords");
  },
  computed: {
    recordNames: function() {
      let names = [];
      if (this.currentRecords) {
        this.currentRecords.forEach(record => names.push(record.name));
      }
      return names;
    },
    ...mapState(["currentRecords"])
  },
  methods: {
    nlp: nlp,
    updateSelection: function(name) {
      this.selectedRecord = this.currentRecords.filter(
        record => record.name == name
      );
    }
  }
};
</script>

