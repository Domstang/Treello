const state = {
  menu: true,
  bgColor: "",
  bgPhoto: "",
  lastUserSelection: ""
};

const getters = {
  getMenuStatus: (state) => {
    return state.menu;
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
      commit('setMenuStatus', menuStatus);
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  updateBgColor({ commit }, color) {
    try {
      commit('setBgColor', color);
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  updateBgPhoto({ commit }, photo) {
    try {
      commit('setBgPhoto', photo);
    } catch (error) {
      throw 'A server error has occurred';
    }
  }
};

const mutations = {
  setMenuStatus(state, menuStatus) {
    state.menu = menuStatus;
  },
  setBgColor(state, color) {
    state.bgColor = color;
    state.lastUserSelection = 'color'
  },
  setBgPhoto(state, photo) {
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