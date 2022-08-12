<template>
  <v-container fluid align="start">
    <v-row justify="start">
      <v-col md="2">
        <v-card class="mx-auto my-12 cards">
          <v-card-title v-if="!active" @click="active = !active"
            >{{ title }}</v-card-title
          >
          <v-text-field
            v-if="active"
            v-model="title"
            dense
            background-color=#fff
            label="Outlined"
            v-click-outside="onClickOutside"
            single-line
            outlined
          ></v-text-field>
          <draggable class="list-group" :list="arrBacklog" group="tasks">
            <transition-group type="transition" name="flip-list">
              <div
                class="list-group-item"
                v-for="(element, index) in arrBacklog"
                :key="element.name"
              >
                {{ element.name }} {{ index }}
              </div>
              <button slot="footer" @click="add(newTask)">Addd</button>
            </transition-group>
          </draggable>
        </v-card>
      </v-col>
      <v-col md="2">
        <v-card class="mx-auto my-12 cards">
          <v-card-title>In Progress</v-card-title>
          <draggable class="list-group" :list="arrInProgress" group="tasks">
            <div
              class="list-group-item"
              v-for="(element, index) in arrInProgress"
              :key="element.name"
            >
              {{ element.name }} {{ index }}
            </div>
          </draggable>
        </v-card>
      </v-col>
    </v-row>
    <div class="side-menu"><side-menu-view /></div>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";
import SideMenuView from "@/sideMenu/SideMenuView";

export default {
  display: "Transition",
  components: {
    draggable,
    SideMenuView,
  },
  data: () => ({
    newTask: "",
    title: "Backlog",
    active: false,
    arrBacklog: [
      { name: "Hello Draggable", id: 1 },
      { name: "Test Dashboard", id: 2 },
      { name: "Style registration", id: 3 },
      {
        name: "Le lorem ipsum est, en imprimerie, une suite de mots sans signification utilisée à titre provisoire pour calibrer une mise en page, le texte définitif venant remplacer le faux-texte dès qu'il est prêt ou que la mise en page est achevée. Généralement, on utilise un texte en faux latin, le Lorem ipsum ou Lipsum.",
        id: 4,
      },
    ],
    arrInProgress: [],
    arrTested: [],
    arrDone: [],
    list1: [],
    list2: [],
  }),
  computed: {},
  methods: {
    add() {
      if (this.newTask) {
        this.arrBacklog.push({ name: this.newTask });
        this.newTask = "";
      }
    },
    onClickOutside() {
      this.active = false
    }
  },
};
</script>
<style scoped>
.side-menu {
  position: absolute;
  top: 20px;
  right: 20px;
}
.cards {
  width: 272px;
  background-color: #ebecf0;
  cursor: pointer;
}
.v-text-field {
  padding: 8px;
}
.list-group {
  padding-bottom: 10px;
  margin-top: -10px;
}
.list-group-item {
  background-color: #fff;
  border-radius: 5px;
  border-bottom: 1px solid rgb(180, 180, 180);
  padding: 6px 10px;
  margin: 0 8px 8px 8px;
  cursor: pointer;
}
.list-group-item:hover {
  background-color: #f4f5f7;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
