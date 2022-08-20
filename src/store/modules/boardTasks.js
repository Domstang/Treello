import Vue from 'vue'
import { tasksCollection, auth, } from "@/firebase";

const state = {
  newTask: {},
  tasks: [],
  updatedTask: [],
  updatedTasksOrder: []
};

const getters = {
  getNewTask: (state) => {
    return state.newTask;
  },
  getUpdatedTask: (state) => {
    return state.updatedTask;
  },
  getAllTasks: (state) => {
    return state.tasks;
  },
}

const actions = {
  async fetchAllTasks({ commit }) {
    let cards = [];
    try {
      const querySnapshot = await tasksCollection
        .where("userId", "==", auth.currentUser.uid)
        .get();
        querySnapshot.forEach(async (doc) => {
          cards.push({
            id: doc.id,
            uniqueId: doc.data().uniqueId,
            title: doc.data().title,
            label: doc.data().label,
            labelColor: doc.data().labelColor,
            listId: doc.data().listId,
            columnNumber: doc.data().columnNumber,
            position: doc.data().position,
          });
        });
      cards.sort((a, b) => a.position - b.position)
      commit('SET_ALL_TASKS', cards);
    } catch (e) {
      console.log(e);
    }
  },
  async addNewTask({ commit }, newTask) {
    try {
      commit('SET_NEW_TASK', newTask);
      const doc = await tasksCollection.add(newTask);
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async updateTask({ commit }, updatedTask) {
    try {
      const querySnapshot = await tasksCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            if (doc.data().uniqueId === updatedTask.uniqueId) {
              doc.ref.update(updatedTask)
            }
          });
        });
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async moveTaskInAnotherList({ commit }, payload) {
    try {
      if (payload.card.id !== payload.id) {
        const querySnapshot = await tasksCollection
          .where("userId", "==", auth.currentUser.uid)
          .get()
          .then((snapshots) => {
            snapshots.forEach((doc) => {
              if (doc.data().id === payload.card.id) {
                doc.ref.update(payload.card)
              }
            });
          });
      }
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async updateTaskOrder({ commit }, updatedTasksOrder) {
    try {
      const querySnapshot = await tasksCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            for (var i = 0; i < updatedTasksOrder.length; i++) {
              if (doc.data().uniqueId === updatedTasksOrder[i].uniqueId) {
                doc.ref.update(updatedTasksOrder[i]);
              }
            }
          });
        });
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
  async removeTask({ commit }, taskToRemove) {
    try {
      let card = taskToRemove.cards.find((el) => el.uniqueId === taskToRemove.id);
      const querySnapshot = await tasksCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            if (doc.data().uniqueId === card.uniqueId) {
              doc.ref.delete();
            }
          });
        });
      commit('SET_REMOVE_TASK', card);
    } catch (error) {
      throw 'A server error has occurred';
    }
  },
};

const mutations = {
  SET_ALL_TASKS(state, allTasks) {
    state.tasks = allTasks;
  },
  SET_NEW_TASK(state, newTask) {
    state.newTask = newTask
    const index = state.tasks.length;
    Vue.set(state.tasks, index, newTask);
  },
  SET_REMOVE_TASK(state, taskToRemove) {
    const index = state.tasks.findIndex(el => el.uniqueId === taskToRemove.uniqueId)
    Vue.delete(state.tasks, index);
  }
};


export default {
  namespaced: true,
  getters,
  actions,
  state,
  mutations
};