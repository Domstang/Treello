import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueEventBus from "vue-plugin-event-bus"; 
import { auth } from './firebase'
// import plugin
import VueToastr from "vue-toastr";
// use plugin
Vue.use(VueToastr, {
  /* OverWrite Plugin Options if you need */
});


Vue.use(VueEventBus);

Vue.config.productionTip = false
let app
auth.onAuthStateChanged(() => {
  if(!app) {
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
}
})
