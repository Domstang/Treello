<template>
  <div>
    <v-row align="start" justify="start" class="d-flex flex-nowrap main-row">
      <v-overlay
        :value="overlay"
        opacity="0.6"
        @click="closeOverlay"
      ></v-overlay>
      <draggable
        v-model="lists"
        ghost-class="ghost"
        class="flex-container main-row"
        v-dragscroll:nochilddrag
      >
        <v-col v-for="list in lists" :key="list.listId" md="2">
          <v-card class="mx-auto my-11 cards" flat data-no-dragscroll>
            <v-card-title
              v-if="!showHeaderInput"
              @click="showHeaderInput = !showHeaderInput"
              >{{ list.title }}</v-card-title
            >
            <v-text-field
              v-if="showHeaderInput"
              v-model="cardTitle"
              outlined
              dense
              background-color="#fff"
              :placeholder="list.title"
              v-click-outside="onClickOutside"
              data-no-dragscroll
            ></v-text-field>
            <board-tasks
              :listId="list.listId"
              :cards="cards"
              @update-task="updateTask"
              @update-tasks-order="updateTasksOrder"
              @remove-task="removeTask"
            />
            <board-add-task
              @add-task="addNewTask"
              @click-outside="onClickOutside"
              :listId="list.listId"
            />
          </v-card>
        </v-col>
        <v-col md="3">
          <board-add-list :lists="lists" :listExists="listExists" />
        </v-col>
      </draggable>
    </v-row>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import { dragscroll } from "vue-dragscroll";
import { listsCollection, tasksCollection, auth } from "@/firebase";
import BoardAddList from "@/modules/board/components/BoardAddList";
import BoardAddTask from "@/modules/board/components/BoardAddTask";
import BoardTasks from "./BoardTasks";
import ShortUniqueId from "short-unique-id";

export default {
  display: "Footer slot",
  directives: {
    dragscroll,
  },
  components: {
    draggable,
    BoardTasks,
    BoardAddList,
    BoardAddTask,
  },
  props: {},
  data: () => ({
    overlay: false,
    defaultCardTitle: "À faire",
    cardTitle: "",
    showHeaderInput: false,
    showFooterInput: false,
    colId: null,
    lists: [],
    cards: [],
    listExists: false,
  }),
  mounted() {
    this.getLists();
  },
  computed: {
    getNewTask() {
      return this.$store.getters["boardTasks/getNewTask"];
    },
    getUpdatedTask() {
      return this.$store.getters["boardTasks/getUpdatedTask"];
    },
  },
  methods: {
    addNewTask(listId, newTaskTitle) {
      const uid = new ShortUniqueId({ length: 40 });
      let position = this.cards.length;
      try {
        let newTask = {
          userId: auth.currentUser.uid,
          uniqueId: uid(),
          title: newTaskTitle,
          label: false,
          labelColor: "",
          listId: listId,
          columnNumber: "",
          position: position,
          draggscroll: true
        };
        this.cards.push(newTask);
        this.$store.dispatch("boardTasks/addNewTask", newTask);
      } catch (e) {
        console.log(e);
      }
    },
    updateTask() {
      this.$store.dispatch("boardTasks/updateTask", this.cards);
    },
    async updateTasksOrder() {
      const newOrder = [];
      const oldOrder = this.cards.forEach(function (item, index) {
        let data = {
          userId: auth.currentUser.uid,
          uniqueId: item?.uniqueId,
          title: item?.title,
          label: item?.label,
          listId: item?.listId,
          labelColor: item?.labelColor,
          columnNumber: item?.columnNumber,
          position: index,
        };
        newOrder.push(data);
      });
      this.$store.dispatch("boardTasks/updateTaskOrder", newOrder);
    },
    removeTask(id) {
      let cards = this.cards;
      this.$store.dispatch("boardTasks/removeTask", { cards, id });
      let updatedCards = cards.filter((data) => data.uniqueId != id);
      this.cards = updatedCards;
    },
    async getLists() {
      try {
        const querySnapshot = await listsCollection
          .where("userId", "==", auth.currentUser.uid)
          .get();
        querySnapshot.forEach(async (doc) => {
          this.lists.push({
            id: doc.id,
            listId: doc.data().listId,
            title: doc.data().title,
            position: doc.data().position,
          });
        });
        this.lists.sort((a, b) => a.position - b.position);
        this.listExists = true;
        this.getTasks();
      } catch (e) {
        console.log(e);
      }
    },
    async getTasks() {
      try {
        this.$store.dispatch("boardTasks/fetchAllTasks");
        const querySnapshot = await tasksCollection
          .where("userId", "==", auth.currentUser.uid)
          .get();
        querySnapshot.forEach(async (doc) => {
          this.cards.push({
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
        this.cards.sort((a, b) => a.position - b.position);
      } catch (e) {
        console.log(e);
      }
    },
    closeOverlay() {
      this.overlay = false;
    },
    onClickOutside() {
      this.showHeaderInput = false;
      this.showFooterInput = false;
      this.overlay = false;
    },
  },
};
</script>
<style scoped>
.main-row {
  padding-left: 10px !important;
  padding-top: 0 !important;
  height: 100%;
  overflow-x: auto;
}
.flex-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: flex-start;
  
}
.cards {
  width: 272px;
  background-color: #ebecf0;
  cursor: pointer;
}
.v-text-field {
  padding: 8px;
}

.v-card__title {
  color: #213456;
  padding-top: 3px;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 500;
  /* AVOID SELECTING TITLES ON SCROLL WITH MOUSE */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.ghost {
  background: lightgray;
  margin-top: 56px;
  border-radius: 5px;
}
/* Draggable transition */
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
