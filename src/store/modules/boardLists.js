import { listsCollection, auth, storage } from "@/firebase";

const state = {
  newList: "",
  lists: [],
  updatedList: [],
  updatedListsOrder: []
};

const getters = {
  getNewList: (state) => {
    return state.newList
  },
  getUpdatedList: (state) => {
    return state.updatedList;
  },
}

const actions = {
  async addNewList({ commit }, newList) {
    try {
      commit('setNewList', newList);
      const doc = await listsCollection.add(newList);
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async updateList({ commit }, updatedList) {
    try {
      commit('setUpdatedList', updatedList);
      const querySnapshot = await listsCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            for (var i = 0; i < updatedList.length; i++) {
              if (doc.data().uniqueId === updatedList[i].uniqueId){
                doc.ref.update(updatedList[i])
              }
            }
          });
        });
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async updateListOrder({ commit }, updatedListsOrder) {
    try {
      commit('setUpdatedListsOrder', updatedListsOrder);
      const querySnapshot = await listsCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            for (var i = 0; i < updatedListsOrder.length; i++) {
              if (doc.data().uniqueId === updatedListsOrder[i].uniqueId) {
                doc.ref.update(updatedListsOrder[i]);
              }
            }
          });
        });
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  /* async removeList({ commit }, taskToRemove ) {
    try {
      let card = listToRemove.cards.find((el) => el.uniqueId === taskToRemove.id);
      const querySnapshot = await listsCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            if (doc.data().uniqueId === card.uniqueId) {
              doc.ref.delete();
            }
          });
        });
    } catch (error) {
      throw 'A server error has occurred';
    }
  }, */
};

const mutations = {
  setNewList(state, newList) {
    state.newList = newList;
    state.lists.push(newList)
  },
  setUpdatedList(state, updatedList) {
    state.newList = updatedList;
  },
  setUpdatedListsOrder(state, updatedListsOrder) {
    state.newList = updatedListsOrder;
  }
};


export default {
  namespaced: true,
  getters,
  actions,
  state,
  mutations
};