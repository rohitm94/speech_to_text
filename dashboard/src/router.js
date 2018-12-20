import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Table from "./views/Table.vue";
import Analyze from "./views/Analyze.vue";
import WhichTable from "./views/WhichTable.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/analyze/:tableNo",
      name: "Analyze",
      component: Analyze
    },
    {
      path: "/",
      name: "Which Table?",
      component: WhichTable
    },
    {
      path: "/table/:tableNo",
      name: "Table",
      component: Table,
      props: true
    }
  ]
});
