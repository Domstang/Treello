import { userSettingsCollection, auth, storage } from "@/firebase";

const state = {
  menu: true,
  background: {},
  bgColor: "",
  bgPhoto: "",
  lastUserSelection: ""
};

const getters = {
  getMenuStatus: (state) => {
    return state.menu;
  },
  getUserSettings: (state) => {
    return state.background;
  },
  getBgColor: (state) => {
    return state.bgColor;
  },
  getBgPhoto: (state) => {
    return state.bgPhoto;
  },
  getLastUserSelection: (state) => {
    return state.lastUserSelection;
  }
}

const actions = {
  sideMenuStatus({ commit }, menuStatus) {
    try {
      commit('SET_MENU_STATUS', menuStatus);
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async fetchBackground({ commit }){
    let background = {}
    try {
      const querySnapshot = await userSettingsCollection
        .where("userId", "==", auth.currentUser.uid)
        .get();
      querySnapshot.forEach(async (doc) => {
        background = {
          userId: auth.currentUser.uid,
          type: doc.data().type,
          background: doc.data().background,
        };
      });
      commit('SET_BACKGROUND', background);
    } catch (e) {
      console.log(e);
    }
  },
  async addBg({ commit }, payload) {
    let background = { 'background': payload.background , 'type': payload.type, 'userId': auth.currentUser.uid}
    try {
      commit('SET_BACKGROUND', background);
      const doc = await userSettingsCollection.add(background);
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async updateBackground({ commit }, payload ) {
    let background = { 'background': payload.background , 'type': payload.type, 'userId': auth.currentUser.uid}
    try {
      commit('SET_BACKGROUND', background);
      const doc = await userSettingsCollection.get()
      .then((snapshots) => {
        snapshots.forEach((doc) => {
          if (doc.data().userId === background.userId) {
            doc.ref.update(background)
          }
        });
      });
    } catch (error) {
      throw 'A server error has occurred';
    }
  }
};

const mutations = {
  SET_MENU_STATUS(state, menuStatus) {
    state.menu = menuStatus;
  },
  SET_BACKGROUND(state, user) {
    state.background = user;
  },
  SET_BG_COLOR(state, color) {
    state.bgColor = color;
  },
  SET_BG_PHOTO(state, photo) {
    state.bgPhoto = photo;
    state.lastUserSelection = 'photo'
  }
};


export default {
  namespaced: true,
  getters,
  actions,
  state,
  mutations
};