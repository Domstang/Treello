import Vue from 'vue'
import Vuex from 'vuex'
import sideMenu from './modules/sideMenu';
import boardTasks from './modules/boardTasks';
import boardLists from './modules/boardLists';
import * as fb from '../firebase'
import { usersCollection, auth, storage } from "@/firebase";
import router from '../router/index'

Vue.use(Vuex)

const NAMESPACES = {
  sideMenu,
  boardTasks,
  boardLists
};

const store = new Vuex.Store({
  plugins: [
  ],
  state: {
    userProfile: {},
    isAuthenticated: false,
    badLogin: false
  },
  getters: {
    getIsAuthenticated: (state) => {
      return state.isAuthenticated;
    },
    getUserProfile: (state) => {
      return state.userProfile;
    },
    getBadLogin: (state) => {
      return state.badLogin;
    }
  },
  actions: {
    async register({ dispatch, commit}, form) {
      // sign up user
      await fb.auth.createUserWithEmailAndPassword(form.email, form.password)
      .then((userCred) => {
        const {user} = userCred
        user.updateProfile({displayName: form.name}).then(() => {
          fb.usersCollection.doc().set({
            name: form.name,
            uid: user.uid
          })
        })
        dispatch('fetchUserProfile', user)
      })
    },
    async login({ dispatch, commit }, form) {
      try {
        // sign in user
        const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      
        dispatch('fetchUserProfile', user)
      } catch (e) {
        const ERROR = JSON.parse(JSON.stringify(e))
        commit('WRONG_IDENTIFIERS', ERROR)
      }
      
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      let userProfile = {}
      try {
        await usersCollection
        .where("uid", "==", auth.currentUser.uid)
        .get()
        .then(() => {
          userProfile = auth.currentUser
        })
        // set user profile
        commit('SET_USER_PROFILE', userProfile)
        if(user !== undefined) {
          // change route or redirect
          router.push('/board')
        }
      } catch (e) {
        if (auth.currentUser) {
          console.log(e);
        }
      }
    },
    resetBadLogin({ commit }){
      commit('RESET_BAD_LOGIN')
    },
    async logout({ commit }) {
      await fb.auth.signOut()
      commit('SET_USER_PROFILE', {})
      router.push('/')
    }
  },
  mutations: {
    SET_USER_PROFILE(state, val, authState) {
      state.isAuthenticated = !state.isAuthenticated
      state.userProfile = val
    },
    WRONG_IDENTIFIERS(state) {
      state.badLogin = true
    },
    RESET_BAD_LOGIN(state) {
      state.badLogin = false
    },
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