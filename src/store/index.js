import Vue from 'vue'
import Vuex from 'vuex'
import sideMenu from './modules/sideMenu';

Vue.use(Vuex)

const NAMESPACES = {
    sideMenu
};

const store = new Vuex.Store({
  plugins: [
  ],
  state: {},
  getters: {},
  actions: {},
  modules: NAMESPACES,
  mutations: {}
});

// Init stores if exist "init" method
Object.keys(NAMESPACES).forEach(key => {
  if (typeof NAMESPACES[key].init === 'function') {
    const ctx = store._modules.root._children[key];
    NAMESPACES[key].init.apply(ctx.state, [ctx.context, store]);
  }
});

// Hack el-tooltip create new Vue instance and don't add $store to components instances
Vue.prototype.$store = store;


export default store;