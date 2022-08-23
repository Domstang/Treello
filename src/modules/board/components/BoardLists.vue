<template>
  <v-row align="start" justify="start" class="d-flex flex-nowrap main-row">
    <v-overlay :value="overlay" opacity="0.6" @click="closeOverlay"></v-overlay>
    <draggable
      v-model="lists"
      ghost-class="ghost"
      class="flex-container main-row"
      handle=".cards"
      v-dragscroll:nochilddrag
      @end="updateListOrder(lists)"
    >
      <v-col v-for="list in lists" :key="list.listId" md="2">
        <v-card handle class="mx-auto my-11 cards" flat data-no-dragscroll>
          <board-update-list-title
            @show-overlay="showOverlay"
            @close-overlay="closeOverlay"
            @update-list-title="updateListTitle"
            :list="list"
          />
          <board-tasks
            :listId="list.listId"
            :newTask="cards"
            @show-overlay="showOverlay"
            @close-overlay="closeOverlay"
            @update-task="updateTask"
            @update-tasks-order="updateTasksOrder"
            @remove-task="removeTask"
          />
          <board-add-task
            :listId="list.listId"
            @click-outside="onClickOutside"
          />
        </v-card>
      </v-col>
      <v-col md="2">
        <board-add-list :lists="lists" :listExists="listExists" />
      </v-col>
    </draggable>
  </v-row>
</template>
<script>
import draggable from "vuedraggable";
import { dragscroll } from "vue-dragscroll";
import { listsCollection, tasksCollection, auth } from "@/firebase";
import BoardAddList from "@/modules/board/components/BoardAddList";
import BoardAddTask from "@/modules/board/components/BoardAddTask";
import BoardUpdateListTitle from "@/modules/board/components/BoardUpdateListTitle";
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
    BoardUpdateListTitle,
  },
  props: {},
  data: () => ({
    overlay: false,
    defaultCardTitle: "À faire",
    showHeaderInput: false,
    colId: null,
    lists: [],
    cards: [],
    listExists: false,
  }),
  async mounted() {
    await this.$store.dispatch("boardLists/fetchAllLists");
    this.lists = this.getAllLists;
    await this.$store.dispatch("boardTasks/fetchAllTasks");
  },
  computed: {
    getAllLists() {
      return this.$store.getters["boardLists/getAllLists"];
    },
    getAllTasks() {
      return this.$store.getters["boardTasks/getAllTasks"];
    },
  },
  methods: {
    addNewTask(val) {
      this.cards.push(val);
    },
    updateListTitle(title) {
      this.$store.dispatch("boardLists/updateList", title);
    },
    updateListOrder(lists) {
      let newOrder = [];
      let oldOrder = lists.forEach(function (item, index) {
        let data = {
          userId: auth.currentUser.uid,
          title: item?.title,
          listId: item?.listId,
          position: index,
        };
        newOrder.push(data);
      });
      console.log("newOrder : ", newOrder);
      this.$store.dispatch("boardLists/updateListOrder", newOrder);
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
      let cards = this.getAllTasks;
      this.$store.dispatch("boardTasks/removeTask", { cards, id });
    },
    showOverlay() {
      this.overlay = true;
    },
    closeOverlay() {
      this.overlay = false;
    },
    onClickOutside() {
      this.showHeaderInput = false;
      this.overlay = false;
    },
  },
};
</script>
<style scoped>
.main-row {
  padding-left: 10px !important;
  padding-top: 10px !important;
  height: 100%;
  max-width: none !important;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.col-md-2 {
  max-width: none !important;
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
