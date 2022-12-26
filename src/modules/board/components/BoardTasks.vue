<template>
  <div v-if="getAllTasks && getAllTasks.length > 0">
  <draggable
    class="list-group"
    ghost-class="ghost"
    :id="listId"
    :list="getAllTasks"
    group="tasks"
    drag-class="drag"
    handle=".list-group-item"
    :move="checkMove"
    @change="updateTaskList($event, listId)"
    @end="getNewIndex(getAllTasks)"
    data-no-dragscroll
    >
  
    <transition-group tag="div" type="transition" name="flip-list">
      <div v-for="card in getAllTasks" :key="card.uniqueId">
        <div
          data-no-dragscroll
          class="list-group-item"
          v-if="card.listId === listId"
        >
          <v-menu :close-on-content-click="false" :nudge-width="0" offset-x>
            <template v-slot:activator="{ on, attrs }">
              <v-hover v-slot="{ hover }">
                <div>
                  <v-system-bar
                    v-if="card.label"
                    dark
                    :color="card.labelColor"
                    class="label"
                  ></v-system-bar>
                  <v-row
                    v-bind="attrs"
                    v-on="on"
                    @mousedown="getCardUniqueId(card.uniqueId)"
                    @click="showTaskMenu()"
                  >
                    <v-col> {{ card.title }}</v-col>
                    <div class="pencil-icon" v-if="hover">
                      <v-icon color="#737F94" size="20" right
                        >mdi-pencil-circle</v-icon
                      >
                    </div>
                  </v-row>
                </div>
              </v-hover>
            </template>
            <div v-if="isMenuVisible">
              <board-task-menu
                :cardUniqueId="card.uniqueId"
                :card="card"
                @close-overlay="closeOverlay"
                @close-modal="closeTaskMenu"
                @add-label-color="addColorLabel"
                @remove-task="removeTask"
              />
            </div>
          </v-menu>
        </div>
      </div>
      <div
        @click.prevent="showAddTaskForm"
        handle
        v-if="!cardsPerList"
        :key="transitionId"
        class="mx-2 mb-2 empty-box"
      >
        <v-icon color="#DEDEF0" class="plus-icon" size="30" center
          >mdi-plus-thick</v-icon
        >
      </div>
    </transition-group>
  </draggable>
</div>
</template>
<script>
import draggable from "vuedraggable";
import { dragscroll } from "vue-dragscroll";
import BoardTaskMenu from "./BoardTaskMenu";
import { auth } from "@/firebase";
import ShortUniqueId from "short-unique-id";
import { mapGetters } from "vuex";

export default {
  display: "Footer slot",
  directives: {
    dragscroll,
  },
  components: {
    draggable,
    BoardTaskMenu,
  },
  props: {
    listId: {
      type: String,
      require: true,
    },
    newTask: {
      type: Array,
      require: true,
    },
  },
  data: () => ({
    overlay: false,
    offset: true,
    cardUniqueId: "",
    labelColor: "primary",
    isMenuVisible: false,
    title: "À faire",
    isDragging: false,
    draggedCardId: "",
    newCardsOrder: [],
    newListId: "",
    cardsPerList: "",
    listIdFromStart: "",
    transitionId: "",
  }),
  async mounted() {
    await this.$store.dispatch("boardTasks/fetchAllTasks");
    this.setTransitionId();
  },
  updated() {
    this.cardsPerList = this.getAllTasks.filter(
      (el) => el.listId === this.listId
    ).length;
  },
  computed: {
    ...mapGetters({
      getAllTasks: "boardTasks/getAllTasks",
      getNewTask: "boardTasks/getNewTask",
    }),
  },

  methods: {
    checkMove(evt) {
      this.newListId = evt.relatedContext.component.$el.id;
      this.dragCardUniqueId = evt.draggedContext.element.uniqueId;
    },
    async updateTaskList(evt, listId) {
      if (!evt.added) {
        this.updateTasksOrder(listId);
      } if (evt.removed){
        let card = this.getAllTasks.find(
          (el) => el.uniqueId === this.dragCardUniqueId
        );
        let cardIndex = this.getAllTasks.indexOf(card);
        let cardCopy = JSON.parse(JSON.stringify(card));
        cardCopy.listId = this.newListId;
        this.updateTasksOrder(cardCopy.listId)
        await this.$store.dispatch("boardTasks/moveTaskInAnotherList", { cardCopy, cardIndex});
      } else {
          return
      }
    },
    showAddTaskForm() {
      this.$eventBus.emit("show-add-task-form", this.listId);
    },
    setTransitionId() {
      let uid = new ShortUniqueId({ length: 40 });
      this.transitionId = uid();
    },
    getCardId(cardUniqueId) {
      this.cardUniqueId = cardUniqueId;
    },
    getCardUniqueId(cardId) {
      this.draggedCardId = cardId;
    },
    clearlistIdOnDrag(listId) {
      let uid = new ShortUniqueId({ length: 40 });
      this.listIdFromStart = listId;
      let card = this.getAllTasks.find(
        (el) => el.uniqueId === this.draggedCardId
      );
      card.listId = "";
      this.draggedCardId = "";
    },
    addColorLabel(label) {
      let card = this.getAllTasks.find((el) => el.uniqueId === label.id);
      card.label = true;
      card.labelColor = label.color;
      this.$store.dispatch("boardTasks/updateTask", card);
    },
    getNewIndex(cards) {
      this.newCardsOrder = cards;
    },
    updateTasksOrder(currentListId) {
      let newOrder = [];
      setTimeout(() => {
        let currentOrder = this.newCardsOrder.filter(
          (el) => el.listId === currentListId
        );
        currentOrder.forEach(function (item, index) {
          let data = {
            userId: auth.currentUser.uid,
            uniqueId: item?.uniqueId,
            title: item?.title,
            label: item?.label,
            listId: item?.listId,
            labelColor: item?.labelColor,
            position: currentOrder.length++,
          };
          newOrder.push(data);
        });
        newOrder.filter((el) => el.listId === currentListId);
        this.$store.dispatch("boardTasks/updateTaskOrder", newOrder);
      }, 500);
    },
    removeTask(id) {
      this.$emit("remove-task", id);
      this.closeTaskMenu();
    },
    showTaskMenu() {
      this.$emit("show-overlay");
      this.isMenuVisible = true;
    },
    closeTaskMenu() {
      this.isMenuVisible = false;
      this.$emit("close-overlay");
    },
    closeOverlay() {
      this.overlay = false;
    },
  },
};
</script>
<style scoped>
.empty-box {
  cursor: pointer;
  background-color: rgb(241, 241, 241);
  border: 2px dashed rgb(217, 217, 217);
  text-align: center;
  border-radius: 3px;
  padding: 30px 5px;
}
.plus-icon {
  cursor: pointer;
}
.label {
  border-radius: 5px;
  height: 8px !important;
  margin-bottom: 5px !important;
  opacity: 0.95;
}
.v-label {
  color: #213456;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
}
.v-menu__content {
  margin-left: 30px !important;
  box-shadow: none;
  overflow: hidden;
}
.list-group {
  color: #213456;
  margin-top: -10px;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  /* AVOID SELECTING TITLES ON SCROLL WITH MOUSE */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.list-group-item {
  background-color: #fff;
  border-radius: 5px;
  border-bottom: 1px solid rgb(180, 180, 180);
  padding: 6px 12px 6px 10px;
  margin: 0 8px 8px 8px;
  cursor: pointer;
}
.list-group-item:hover {
  background-color: #f4f5f7;
  opacity: 1 !important;
}
.list-group-item:focus {
  opacity: 1 !important;
  background-color: #ffffff !important;
}
.list-group-item:active {
  opacity: 1 !important;
  background-color: #ffffff !important;
}
.pencil-icon {
  position: absolute;
  padding: 10px;
  right: 0;
}
.v-text-field {
  margin-top: -7px;
}
.drag > div {
  transform: rotate(5deg);
}
.ghost {
  background: lightgray;
  border-radius: 5px;
}
.ghost > div {
  /* visibility: hidden; */
  transform: translate(0px, 50%);
}
/* Draggable transition */
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
