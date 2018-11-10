import '@babel/polyfill';
import Vue from 'vue';
import './plugins/axios'
import './plugins/vuetify';
import AudioRecorder from 'vue-audio-recorder';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(AudioRecorder);

new Vue({
  render: h => h(App),
}).$mount('#app');
