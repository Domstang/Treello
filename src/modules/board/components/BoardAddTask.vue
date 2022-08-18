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
  mounted() {},
  computed: {},
  methods: {
    addNewTask(listId) {
      this.$emit('add-task', listId, this.newTaskTitle)
      this.newTaskTitle = ""
      this.showFooterInput = false;
    },
    onClickOutside() {
      this.showFooterInput = false;
      this.$emit('click-outside')
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
.close-icon:hover {
  color: #156ef5 !important;
  transition-duration: 0.2s;
  transform: scale(1.1);
}
</style>