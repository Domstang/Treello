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
    userName: {}
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
  actions: {
    /* async register({ commit}, form) {
      console.log("🚀 ~ register ~ form", form)
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
      
    },
    async login({ dispatch }, form) {
      await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      router.push('/board')
    },
    
    async logout({ commit }) {
      await fb.auth.signOut()
      commit('setUserProfile', {})
      router.push('/')
    } */
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
          /* commit('setUserName', fb.auth.currentUser.displayName) */
        })
        dispatch('fetchUserProfile', user)
      })
    },
    async login({ dispatch }, form) {
      // sign in user
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)
      
      dispatch('fetchUserProfile', user)
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      let userProfile = {}
      await usersCollection
      .where("uid", "==", auth.currentUser.uid)
      .get()
      .then(() => {
        userProfile = auth.currentUser
      })
      // set user profile
      commit('setUserProfile', userProfile)
      if(user !== undefined) {
        // change route or redirect
        localStorage.setItem('userName', JSON.stringify(userProfile.displayName));
        router.push('/board')
      }
    },
    async fetchUserName({ commit }) {
      // fetch user profile
      let userProfile = {}
      await usersCollection
      .where("uid", "==", auth.currentUser.uid)
      .get()
      .then(() => {
        userProfile = auth.currentUser
      })
      // set user profile
      commit('setUserName', userProfile)
    },
    async logout({ commit }) {
      await fb.auth.signOut()
      commit('setUserProfile', {})
      router.push('/')
    }
  },
  mutations: {
    /* setUserProfile(state, val) {
      state.userProfile = val
    }, */
    setUserProfile(state, val, authState) {
      state.isAuthenticated = !state.isAuthenticated
      state.userProfile = val
    },
    setUserName(state, val) {
      state.userName = val;
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