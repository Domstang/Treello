<template>
  <div>
    <v-form v-if="showFooterInput">
      <div v-click-outside="onClickOutside">
        <v-textarea
          v-model="newTaskTitle"
          class="mb-0 pb-0 px-2"
          solo
          auto-grow
          clearable
          clear-icon="mdi-close-circle"
          rows="3"
          name="footer-input"
          background-color="#fff"
          label="Saisissez un titre pour cette carte..."
          @keydown.enter.exact.prevent="addNewTask(listId)"
          data-no-dragscroll
        ></v-textarea>
        <v-row align="center" justify="start">
          <v-btn
            depressed
            small
            align="left"
            class="primary ps-2 ml-5 mb-2"
            @click.stop="addNewTask(listId)"
            >Ajouter une carte</v-btn
          >
          <v-icon
            left
            class="pb-2 pl-2 close-icon"
            @click.stop="showFooterInput = false"
            >mdi-close</v-icon
          >
        </v-row>
      </div>
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
  </div>
</template>
<script>
import ShortUniqueId from "short-unique-id";
import { auth } from "@/firebase";

export default {
  components: {},
  props: {
    listId: {
      type: String,
      require: true
    },
  },
  data: () => ({
    showFooterInput: false,
    newTaskTitle: "",
  }),
  created() {
    this.$eventBus.on('show-add-task-form', this.showAddTaskForm)
  },
  async mounted() {
    await this.$store.dispatch("boardTasks/fetchAllTasks");
  },
  beforeDestroy(){
    this.$eventBus.$off("show-add-task-form")
  },
  computed: {
    getAllTasks() {
      return this.$store.getters["boardTasks/getAllTasks"];
    },
  },
  methods: {
    showAddTaskForm(listId) {
      if (this.listId ===listId) this.showFooterInput = true;
    },
    addNewTask(listId) {
      const uid = new ShortUniqueId({ length: 40 });
      let position = this.getAllTasks.filter((el) => el.listId === listId).length;
      try {
        let newTask = {
          userId: auth.currentUser.uid,
          uniqueId: uid(),
          title: this.newTaskTitle,
          label: false,
          labelColor: "",
          listId: listId,
          position: ++position,
          draggscroll: true,
        };
        this.$store.dispatch("boardTasks/addNewTask", newTask);
      } catch (e) {
        console.log(e);
      }
      this.newTaskTitle = ""
      this.showFooterInput = false;
    },
    onClickOutside() {
      this.showFooterInput = false;
    },
  },
};
</script>
<style scoped>
.v-textarea {
  color: #213456;
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  font-weight: 500;
}
.v-btn {
  font-family: 'Roboto', sans-serif;
  font-size: 13px;
}
.v-label {
  top: 10px !important;
  font-size: 13px !important;
  font-family: 'Roboto', sans-serif !important;
  color: #21345699 !important;
}
.close-icon:hover {
  color: #156ef5 !important;
  transition-duration: 0.2s;
  transform: scale(1.1);
}
</style>