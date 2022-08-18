<template>
  <v-card class="mx-auto my-11 p-10 card" :class="!showForm ? 'card' : 'card-reveal'" flat>
    <div class="card-content">
      <v-form v-if="showForm">
        <div v-click-outside="onClickOutside">
          <v-text-field
            v-model="newTaskFromInput"
            class="mb-0 px-2 pt-2"
            outlined
            dense
            clearable
            clear-icon="mdi-close-circle"
            name="footer-input"
            background-color="#fff"
            label="Saisissez le titre de cette liste..."
            @keydown.enter.exact.prevent="addNewList()"
            data-no-dragscroll
          ></v-text-field>
          <v-row align="center" justify="start">
            <v-btn
              depressed
              small
              align="left"
              class="primary ps-2 ml-5 mb-2"
              @click.stop="addNewList()"
              >Ajouter une liste</v-btn
            >
            <v-icon
              color="#737F94"
              left
              class="pb-2 pl-2 close-icon"
              @click.stop="showForm = false"
              >mdi-close</v-icon
            >
          </v-row>
        </div>
      </v-form>
      <div class="text-left">
        <v-btn
          v-if="!showForm"
          depressed
          class="open-btn py-5"
          @click="showForm = true"
        >
          <v-icon color="#737F94" left>mdi-plus</v-icon>
          Ajoutez une autre liste</v-btn
        >
      </div>
    </div>
  </v-card>
</template>
<script>
import ShortUniqueId from "short-unique-id";
import { listsCollection, auth } from "@/firebase";
export default {
  data: () => ({
    showForm: false,
    newTaskFromInput: "",
  }),
  props: {
    lists: {
      type: Array,
      require: true,
    },
    listExists: {
      type: Boolean,
      require: true,
    },
  },
  updated() {
    this.checkIfListExists()
  },
  methods: {
    checkIfListExists() {
      if(!this.listExists) this.showForm = true;
    },
    addNewList() {
      const uid = new ShortUniqueId({ length: 40 });
      let position = this.lists.length;
      try {
        let newList = {
          userId: auth.currentUser.uid,
          listId: uid(),
          title: this.newTaskFromInput,
          position: position,
        };
        this.lists.push(newList);
        this.$store.dispatch("boardLists/addNewList", newList);
      } catch (e) {
        console.log(e);
      }
      this.newTaskFromInput = "";
      this.showForm = false;
    },
    onClickOutside() {
      this.showForm = false;
    },
  },
};
</script>
<style scoped>
.v-card__actions {
  padding: 5px !important;
}
.card {
  width: 292px !important;
  margin-left: -5px !important;
  background-color: #cbcccf00;
  cursor: pointer;
}
.card-reveal {
  width: 292px !important;
  margin-left: -5px !important;
  background-color: #cbcccfc8;
  cursor: pointer;
}
.open-btn {
  width: 272px;
  background-color: #cbcccfc8 !important;
  color: #213456 !important;
  font-family: "Roboto", sans-serif !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  justify-content: left;
}
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
