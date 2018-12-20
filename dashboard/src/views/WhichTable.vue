<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row fill-height align-center justify-center xs12 pa-5 ma-5>
      <v-flex>
        <h1 class="text-xs-right">What table is this?</h1>
      </v-flex>
      <v-flex>
        <v-select :items="tables" style="width: 128px" editable @change="goTo"></v-select>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["tables"]),
  methods: {
    goTo: function(value) {
      this.$store.commit("updateTabRoutes", {
        recordRoute: "/table/" + parseInt(value),
        analyzeRoute: "/analyze/" + parseInt(value)
      });
      this.$router.push({
        path: "/table/" + parseInt(value)
      });
    }
  }
};
</script>
