import Vue from 'vue'
import Vuex from 'vuex'
import sideMenu from './modules/sideMenu';
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

const NAMESPACES = {
  sideMenu,
};

const store = new Vuex.Store({
  plugins: [
  ],
  state: {
    userProfile: {},
    isAuthenticated: false,
    userName: ""
  },
  getters: {
    getIsAuthenticated: (state) => {
      return state.isAuthenticated;
    },
    getUserProfile: (state) => {
      return state.userProfile;
    },
    getUserName: (state) => {
      return state.userName;
    }
  },
  mutations: {
    setUserProfile(state, val, authState) {
      /* state.isAuthenticated = !state.isAuthenticated */
      state.userProfile = val
    },
    setUserName(state, val) {
      state.userName = val;
      console.log("🚀 ~ setUserName ~ state.userName", state.userName)
    },
  },
  actions: {
    async register({ commit}, form) {
      // sign up user
      await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
      // create user profile object
      .then((userCred) => {
        const {user} = userCred
        user.updateProfile({displayName: form.name}).then(() => {
          commit('setUserName', fb.auth.currentUser.displayName)
          fb.usersCollection.doc(this.userNamed).set({
            name: form.name,
            uid: user.uid
          })
        });
      })
      .then(router.push('/board'))
      .catch((error) => {
        this.error = error.message;
        console.log("err", error);
      })
      
      /* await fb.usersCollection.doc(this.userNamed).set({
        name: form.name,
        uid: user.uid
      }) */
      // fetch user profile
      /* dispatch('fetchUserProfile', user) */
    },
    async login({ dispatch }, form) {
      // sign in user
      await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      router.push('/board')
      // fetch user profile
      /* dispatch('fetchUserProfile', user) */
    },
    
    async logout({ commit }) {
      await fb.auth.signOut()
      commit('setUserProfile', {})
      router.push('/')
    }
  },
  modules: NAMESPACES,
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