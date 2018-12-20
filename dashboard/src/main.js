import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "./registerServiceWorker";
import AudioRecorder from "vue-audio-recorder";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.config.productionTip = false;
Vue.use(AudioRecorder);

Vue.use({
  install(Vue) {
    Vue.prototype.$jarvis = axios.create({
      baseURL: "http://localhost:3000/",
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
});

Vue.use({
  install(Vue) {
    Vue.prototype.$http = axios;
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
