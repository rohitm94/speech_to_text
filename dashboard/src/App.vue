<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list two-line>
        <v-list-tile @click="$router.push('/')">
          <v-list-tile-content>
            <h2>Home</h2>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="$router.push('/table/' + $state.currentTableNo)">
          <v-list-tile-content>
            <h2>Table</h2>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="primary" dark fixed app extended tabs>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>ITCS 6112 - Speech to Text</v-toolbar-title>

      <!-- <v-toolbar-title slot="extension">Hey there</v-toolbar-title> -->
      <v-tabs slot="extension" color="primary" centered>
        <v-tab :to="currentRecordRoute">Record</v-tab>
        <v-tab :to="currentAnalyzeRoute">Analyze</v-tab>
      </v-tabs>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>

    <v-footer color="primary" app>
      <span
        class="white--text"
        style="text-indent: 5em"
      >&copy; 2018 - UNCC ITCS 6112 Speech to Text team</span>
    </v-footer>
  </v-app>
</template>
<script>
import HelloWorld from "./components/HelloWorld";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      drawer: null
      //
    };
  },
  created: function() {
    this.$store.dispatch("initStore");
  },
  computed: {
    ...mapState(["currentRecordRoute", "currentAnalyzeRoute"])
  }
};
</script>
