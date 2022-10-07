import Vue from 'vue'
import { listsCollection, tasksCollection, auth, storage } from "@/firebase";

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
      if (auth.currentUser) {
        console.log(e);
      }
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
  async removeList({ commit }, listToRemove ) {
    try {
      let cardsToRemove = listToRemove.cards.filter((el) => el.listId === listToRemove.id);
        await tasksCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            if (doc.data().listId === listToRemove.id) {
              doc.ref.delete();
            }
          });
        });
        await listsCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            if (doc.data().listId === listToRemove) {
              console.log('hello')
            }
          });
        });
        /* commit('SET_REMOVE_LIST', cardsToRemove); */
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
};

const mutations = {
  SET_All_LISTS(state, lists) {
    state.lists = lists;
  },
  SET_NEW_LIST(state, newList) {
    const index = state.lists.length;
    Vue.set(state.lists, index, newList);
  },
  /* SET_REMOVE_LIST(state, listToRemove) {
    const index = state.tasks.findIndex(el => el.uniqueId === listToRemove.uniqueId)
    Vue.delete(state.tasks, index);
  } */
};


export default {
  namespaced: true,
  getters,
  actions,
  state,
  mutations
};