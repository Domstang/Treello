<template>
  <v-row
    justify="start"
    class="d-flex flex-nowrap scroll-bar main-row"
    v-dragscroll
  >
    <v-overlay :value="overlay" opacity="0.6" @click="closeOverlay"></v-overlay>
    <v-col md="2" data-no-dragscroll>
      <v-card class="mx-auto my-12 cards">
        <v-card-title
          data-no-dragscroll
          v-if="!showHeaderInput"
          @click="showHeaderInput = !showHeaderInput"
          >{{ title }}</v-card-title
        >
        <v-text-field
          v-if="showHeaderInput"
          v-model="title"
          dense
          background-color="#fff"
          label="Outlined"
          v-click-outside="onClickOutside"
          single-line
          outlined
          data-no-dragscroll
        ></v-text-field>
        <draggable
          v-model="cards"
          class="list-group"
          ghost-class="ghost"
          :list="cards"
          group="tasks"
          drag-class="drag"
          @end="getCardPosition"
          data-no-dragscroll
        >
          <transition-group tag="div" type="transition" name="flip-list">
            <div
              class="list-group-item"
              v-for="(card, index) in cards"
              :key="card.uniqueId"
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
                        @mousedown="getCardId(card.id)"
                        @click="showTaskModal"
                      >
                        <v-col> {{ card.title }}</v-col>
                        <v-spacer></v-spacer>
                        <v-col> {{ index }} </v-col>
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
                    :cardId="card.id"
                    @close-overlay="closeOverlay"
                    @close-modal="closeTaskModal"
                    @add-label-color="addColorLabel"
                  />
                </div>
              </v-menu>
            </div>
          </transition-group>
        </draggable>
        <v-form>
          <v-textarea
            v-if="showFooterInput"
            v-model="newTask"
            class="mb-0 pb-0"
            solo
            auto-grow
            clearable
            clear-icon="mdi-close-circle"
            rows="3"
            name="footer-input"
            background-color="#fff"
            label="Saisissez un titre pour cette carte..."
            @keydown.enter.exact.prevent="addNewTask()"
            data-no-dragscroll
          ></v-textarea>
          <v-row v-if="showFooterInput" align="center" justify="start">
            <v-btn
              color="#737F94"
              depressed
              small
              align="left"
              class="primary ps-2 ml-5 mb-2"
              @click.stop="addNewTask()"
              >Ajouter une carte</v-btn
            >
            <v-icon
              color="#737F94"
              left
              class="pb-2 pl-2 close-icon"
              @click.stop="showFooterInput = false"
              >mdi-close</v-icon
            >
          </v-row>
        </v-form>
        <div class="text-left">
          <v-btn
            v-if="!showFooterInput"
            color="#737F94"
            plain
            @click="showFooterInput = true"
          >
            <v-icon color="#737F94" left>mdi-plus</v-icon>
            Ajouter une carte</v-btn
          >
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import draggable from "vuedraggable";
import { dragscroll } from "vue-dragscroll";
import { tasksCollection, auth, storage } from "@/firebase";
import BoardTaskModal from "@/commons/board/BoardTaskModal";
import ShortUniqueId from "short-unique-id";

export default {
  display: "Footer slot",
  directives: {
    dragscroll,
  },
  components: {
    draggable,
    BoardTaskModal,
  },
  data: () => ({
    overlay: false,
    zIndex: 0,
    offset: true,
    newTask: "",
    cardId: "",
    labelColor: "primary",
    isModalVisible: false,
    title: "À faire",
    showHeaderInput: false,
    showFooterInput: false,
    oldIndex: "",
    newIndex: "",
    cards: [
      /* { title: "Hello Draggable", id: "1", label: false, labelColor: ""},
      { title: "Test Dashboard", id: "2", label: false, labelColor: "" },
      { title: "Style registration", id: "3", label: false, labelColor: "" }, */
    ],
  }),

  async mounted() {
    await this.getTasks();
  },
  computed: {},
  methods: {
    getCardId(cardId) {
      this.cardId = cardId;
    },
    getCardPosition() {
      this.updateTasksOrder();
    },
    async addNewTask() {
      const uid = new ShortUniqueId({ length: 40 });
      let position = this.cards.length;
      try {
        let data = {
          userId: auth.currentUser.uid,
          uniqueId: uid(),
          title: this.newTask,
          label: false,
          labelColor: "",
          columnNumber: "",
          position: position,
        };
        this.cards.push(data);
        const doc = await tasksCollection.add(data);
      } catch (e) {
        console.log(e);
      }
      this.newTask = "";
      this.showFooterInput = false;
    },
    async updateTask() {
      let card = this.cards.find((el) => el.id === this.cardId);
      try {
        let data = {
          userId: auth.currentUser.uid,
          uniqueId: card?.uniqueId,
          title: card?.title,
          label: card?.label,
          labelColor: card?.labelColor,
          columnNumber: card?.columnNumber,
          position: card?.position,
        };
        console.log(data);
        const doc = await tasksCollection.doc(this.cardId).update(data);
      } catch (e) {
        console.log(e);
      }
    },
    async updateTasksOrder() {
      const newOrder = [];
      const oldOrder = this.cards.forEach(function (item, index) {
        let data = {
          userId: auth.currentUser.uid,
          uniqueId: item?.uniqueId,
          title: item?.title,
          label: item?.label,
          labelColor: item?.labelColor,
          columnNumber: item?.columnNumber,
          position: index,
        };
        newOrder.push(data);
      });
      const querySnapshot = await tasksCollection
        .where("userId", "==", auth.currentUser.uid)
        .get()
        .then((snapshots) => {
          snapshots.forEach((doc) => {
            for (var i = 0; i < newOrder.length; i++) {
              if (doc.data().uniqueId === newOrder[i].uniqueId){
                doc.ref.update(newOrder[i])
              }
            }
          });
        });
    },
    async getTasks() {
      try {
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
            columnNumber: doc.data().columnNumber,
            position: doc.data().position,
          });
        });
        // The most recent task goes on Bottom (ordered Asc)
        this.cards.sort(({ position: a }, { position: b }) => a - b);
      } catch (e) {
        console.log(e);
      }
    },
    addColorLabel(payload) {
      let card = this.cards.find((el) => el.id === payload.id);
      card.label = true;
      card.labelColor = payload.color;
      this.updateTask();
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
  padding-left: 40px !important;
}
.scroll-bar {
  padding-left: 20px;
  padding-right: 20px;
  overflow-x: auto;
  height: 100%;
}
.label {
  border-radius: 5px;
  height: 7px !important;
  margin-bottom: 5px !important;
}
.cards {
  width: 272px;
  background-color: #ebecf0;
  cursor: pointer;
}
.v-text-field {
  padding: 8px;
}
.v-textarea {
  color: #213456;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
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
.close-icon:hover {
  color: #156ef5 !important;
  transition-duration: 0.2s;
  transform: scale(1.1);
}
.drag > div {
  transform: rotate(5deg);
}
.ghost {
  background: lightgray;
  border-radius: 5px;
}
.ghost > div {
  visibility: hidden;
}
/* Draggable transition */
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
