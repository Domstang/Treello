<template>
  <div>
    <v-row v-if="!showHeaderInput" class="pl-2 pr-4" align="baseline">
      <v-card-title
        class="cursor"
        @click="showHeaderInput = !showHeaderInput"
        >{{ list.title }}</v-card-title
      ><v-spacer></v-spacer>
      <v-menu :close-on-content-click="false" :nudge-width="0" offset-x >
        <template v-slot:activator="{ on, attrs }">
          <v-icon @click="showListMenu()" v-bind="attrs" v-on="on" color="#bbb" size="20"
            >mdi-dots-vertical</v-icon
          >
        </template>
        <div v-if="isMenuVisible">
          <board-list-menu
            :listId="list.listId"
            @close-overlay="closeOverlay"
            @close-menu="closeListModal"
            @remove-task="removeList"
          />
        </div>
      </v-menu>
    </v-row>
    <v-text-field
      v-if="showHeaderInput"
      v-model="list.title"
      outlined
      dense
      clearable
      background-color="#fff"
      :placeholder="list.title"
      v-click-outside="onClickOutside"
      @keydown.enter.exact.prevent="updateTitle(list)"
      data-no-dragscroll
    ></v-text-field>
  </div>
</template>
<script>
import BoardListMenu from "./BoardListMenu";
export default {
  components: {
    BoardListMenu
  },
  props: {
    list: {
      type: Object,
      require: true,
    },
  },
  computed: {},
  data: () => ({
    previousTitle: "",
    showHeaderInput: false,
    isMenuVisible: false,
  }),
  mounted() {
    this.previousTitle = this.list.title;
  },
  methods: {
    updateTitle(updatedList) {
      if (updatedList.title) {
        this.$emit("update-list-title", { ...updatedList });
      } else {
        this.list.title = this.previousTitle;
      }

      this.showHeaderInput = false;
    },
    showListMenu() {
      this.$emit('show-overlay')
      this.isMenuVisible = true;
    },
    onClickOutside() {
      this.list.title = this.previousTitle;
      this.showHeaderInput = false;
    },
  },
};
</script>
<style scoped>
.cursor {
  cursor: default !important;
}
.v-text-field {
  padding: 8px;
}
.v-menu__content {
    margin-left: 5px !important;
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
</style>
