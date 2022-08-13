<template>
  <v-row justify="space-between" align="start" class="d-flex flex-nowrap scroll-bar">
    <v-col class="pl-10">
      <v-card class="mx-auto my-12 cards">
        <v-card-title
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
        ></v-text-field>
        <draggable
          class="list-group"
          :list="list1"
          group="tasks"
          @update="positionIndex"
        >
          <transition-group tag="div" type="transition" name="flip-list">
            <div
              class="list-group-item"
              v-for="element in list1"
              :key="element.id"
            >
              <v-hover v-slot="{ hover }">
                <div>
                  <v-row>
                    <v-col>
                      {{ element.title }}
                      <!-- {{ index }} -->
                    </v-col>
                    <div class="pencil-icon" v-if="hover">
                      <v-icon color="#737F94" size="20" right
                        >mdi-pencil-circle</v-icon
                      >
                    </div>
                  </v-row>
                </div>
              </v-hover>
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
            v-click-outside="onClickOutside"
          ></v-textarea>
          <v-row v-if="showFooterInput" align="center" justify="start">
            <v-btn
              color="#737F94"
              depressed
              small
              align="left"
              class="primary ps-2 ml-5 mb-2"
              @click="addNewTask()"
              >Ajouter une carte</v-btn
            >
            <v-icon
              color="#737F94"
              left
              class="pb-2 pl-2"
              @click="!showFooterInput"
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
    <v-col>
      <v-card class="mx-auto my-12 cards">
        <v-card-title>In Progress</v-card-title>
        <draggable class="list-group" :list="list2" group="tasks">
          <div
            class="list-group-item"
            v-for="(element, index) in list2"
            :key="element.name"
          >
            {{ element.name }} {{ index }}
          </div>
        </draggable>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto my-12 cards">
        <v-card-title>In Progress</v-card-title>
        <draggable class="list-group" :list="list2" group="tasks">
          <div
            class="list-group-item"
            v-for="(element, index) in list2"
            :key="element.name"
          >
            {{ element.name }} {{ index }}
          </div>
        </draggable>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto my-12 cards">
        <v-card-title>In Progress</v-card-title>
        <draggable class="list-group" :list="list2" group="tasks">
          <div
            class="list-group-item"
            v-for="(element, index) in list2"
            :key="element.name"
          >
            {{ element.name }} {{ index }}
          </div>
        </draggable>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto my-12 cards">
        <v-card-title>In Progress</v-card-title>
        <draggable class="list-group" :list="list2" group="tasks">
          <div
            class="list-group-item"
            v-for="(element, index) in list2"
            :key="element.name"
          >
            {{ element.name }} {{ index }}
          </div>
        </draggable>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="mx-auto my-12 cards">
        <v-card-title>In Progress</v-card-title>
        <draggable class="list-group" :list="list2" group="tasks">
          <div
            class="list-group-item"
            v-for="(element, index) in list2"
            :key="element.name"
          >
            {{ element.name }} {{ index }}
          </div>
        </draggable>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import draggable from "vuedraggable";
import { tasksCollection, auth } from "@/firebase";
export default {
  display: "Footer slot",
  components: {
    draggable,
  },
  data: () => ({
    newTask: "",
    title: "À faire",
    showHeaderInput: false,
    showFooterInput: false,
    list1: [
      { title: "Hello Draggable", id: 1 },
      { title: "Test Dashboard", id: 2 },
      { title: "Style registration", id: 3 },
      {
        title:
          "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum.",
        id: 4,
      },
    ],
    list2: [],
    list3: [],
    list4: [],
  }),
  async mounted() {
    await this.getTasks();
  },
  methods: {
    async addNewTask() {
      if (this.newTask) {
        this.list1.push({ name: this.newTask });
        try {
          let data = {
            userId: auth.currentUser.uid,
            title: this.newTask,
          };
          const doc = await tasksCollection.add(data);
        } catch (e) {
          console.log(e);
        }
        this.newTask = "";
      }
    },
    async getTasks() {
      try {
        const querySnapshot = await tasksCollection
          .where("userId", "==", auth.currentUser.uid)
          .get();
        querySnapshot.forEach(async (doc) => {
          this.list1.push({
            id: doc.id,
            title: doc.data().title,
          });
        });
      } catch (e) {
        console.log(e);
      }
    },
    onClickOutside() {
      this.showHeaderInput = false;
      this.showFooterInput = false;
    },
    positionIndex(e) {
      console.log("e = ", e);
      console.log("index de départ = ", e.oldIndex);
      console.log("index d'arrivée = ", e.newIndex);
    },
  },
};
</script>
<style scoped>
.scroll-bar {
  overflow-x: auto;
  height: 100%;
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
.v-card__title {
  color: #213456;
  padding-top: 3px;
  font-family: "Roboto", sans-serif;
  font-size: 16px;
  font-weight: 500;
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
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.v-text-field {
  margin-top: -7px;
}
</style>
