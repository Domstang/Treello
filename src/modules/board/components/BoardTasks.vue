<template>
  <draggable
    class="list-group"
    ghost-class="ghost"
    :id="listId"
    :list="cards"
    v-model="cards"
    group="tasks"
    drag-class="drag"
    :move="checkMove"
    @start="clearlistIdOnDrag(listId)"
    @end="getNewIndex(cards)"
    data-no-dragscroll
  >
    <transition-group tag="div" type="transition" name="flip-list">
      <div v-for="card in cards" :key="card.id">
        <div data-no-dragscroll class="list-group-item" v-if="card.listId === listId">
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
                    @click="showTaskModal()"
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
            <div v-if="isModalVisible">
              <board-task-modal
                :cardUniqueId="card.uniqueId"
                @close-overlay="closeOverlay"
                @close-modal="closeTaskModal"
                @add-label-color="addColorLabel"
                @remove-task="removeTask"
              />
            </div>
          </v-menu>
        </div>
      </div>
    </transition-group>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
import { dragscroll } from "vue-dragscroll";
import BoardTaskModal from "./BoardTaskModal";
import { auth } from "@/firebase";

export default {
  display: "Footer slot",
  directives: {
    dragscroll,
  },
  components: {
    draggable,
    BoardTaskModal,
  },
  props: {
    listId: {
      type: String,
      require: true,
    },
    cards: {
      type: Array,
      require: true,
    },
  },
  data: () => ({
    overlay: false,
    offset: true,
    cardUniqueId: "",
    labelColor: "primary",
    isModalVisible: false,
    title: "À faire",
    isDragging: false,
    draggedCardId: "",
    newCardsOrder: [],
    listIdFromStart: "",
  }),
  computed: {
    getAllTasks() {
      return this.$store.getters["boardTasks/getAllTasks"];
    }
  },
  /* watch: {
    getAllTasks(newValue) {
      this.cards.push(newValue)
    }
  }, */
  beforeUpdate() {
    console.log(this.getAllTasks)
  },
  methods: {
    getCardId(cardUniqueId) {
      this.cardUniqueId = cardUniqueId;
    },
    getCardUniqueId(cardId) {
      this.draggedCardId = cardId;
    },
    clearlistIdOnDrag(listId) {
      this.listIdFromStart = listId;
      let card = this.cards.find((el) => el.uniqueId === this.draggedCardId);
      card.listId = "";
      card.position = "";
      this.draggedCardId = "";
    },
    checkMove(evt) {
      let cardUniqueId = evt.draggedContext.element.uniqueId;
      let newListId = evt.relatedContext.component.$el.id;
      let card = this.cards.find((el) => el.uniqueId === cardUniqueId);
      card.listId = newListId;
      this.$store.dispatch("boardTasks/moveTaskInAnotherList", { 'card':card, 'id':this.listIdFromStart });
      setTimeout(() => {
        this.updateTasksOrder(newListId);
      }, 500);
    },
    addColorLabel(label) {
      let card = this.cards.find((el) => el.uniqueId === label.id);
      card.label = true;
      card.labelColor = label.color;
      this.$store.dispatch("boardTasks/updateTask", card);
    },
    updateTask() {
      this.$store.dispatch("boardTasks/updateTask", this.cards);
    },
    getNewIndex(cards) {
      this.newCardsOrder = cards;
    },
    updateTasksOrder(currentListId) {
      let newOrder = [];
      let currentList = this.cards.filter((el) => el.listId === currentListId);

      setTimeout(() => {
        let currentOrder = this.newCardsOrder.filter((el) => el.listId === currentListId);
        let oldOrder = currentOrder.forEach(function (item, index) {
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
        newOrder.filter((el) => el.listId === currentListId);
        this.$store.dispatch("boardTasks/updateTaskOrder", newOrder);
      }, 1000);
    },
    removeTask(id) {
      this.$emit("remove-task", id);
      this.closeTaskModal();
    },
    showTaskModal() {
      this.overlay = true;
      this.isModalVisible = true;
    },
    closeTaskModal() {
      this.isModalVisible = false;
      this.overlay = false;
    },
    closeOverlay() {
      this.overlay = false;
    },
  },
};
</script>
<style scoped>
.label {
  border-radius: 5px;
  height: 7px !important;
  margin-bottom: 5px !important;
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
}
/* Draggable transition */
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
