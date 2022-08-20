import { listsCollection, auth, storage } from "@/firebase";

const state = {
  newList: "",
  lists: [],
  updatedList: [],
  updatedListsOrder: []
};

const getters = {
  getAllLists: (state) => {
    return state.lists
  },
  getUpdatedList: (state) => {
    return state.updatedList;
  },
}

const actions = {
  async fetchAllLists({ commit }) {
    let lists = [];
    try {
      const querySnapshot = await listsCollection
        .where("userId", "==", auth.currentUser.uid)
        .get();
      querySnapshot.forEach(async (doc) => {
        lists.push({
          id: doc.id,
          listId: doc.data().listId,
          title: doc.data().title,
          position: doc.data().position,
        });
      });
      lists.sort((a, b) => a.position - b.position);
      commit('SET_All_LISTS', lists);
    } catch (e) {
      console.log(e);
    }
  },
  async addNewList({ commit }, newList) {
    try {
      commit('SET_NEW_LIST', newList);
      const doc = await listsCollection.add(newList);
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async updateList({ commit }, updatedList) {
    try {
      const querySnapshot = await listsCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
              if (doc.data().listId === updatedList.listId){
                doc.ref.update(updatedList)
              }
          });
        });
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async updateListOrder({ commit }, updatedListsOrder) {
    try {
      const querySnapshot = await listsCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            for (var i = 0; i < updatedListsOrder.length; i++) {
              if (doc.data().listId === updatedListsOrder[i].listId) {
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
  SET_All_LISTS(state, lists) {
    state.lists = lists;
  },
  SET_NEW_LIST(state, newList) {
    state.lists.push(newList);
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