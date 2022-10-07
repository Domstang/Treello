<template>
  <div>
    <v-icon @click="closeMenu" class="close-icon"
      >mdi-close</v-icon
    >
    <v-row class="row-buttons">
      <v-col sm="4">
        <v-menu
          v-model="inputTitleMenu"
          :close-on-content-click="false"
          offset-y
        >
          <template v-slot:activator="{ attrs, on }">
            <v-hover v-slot="{ hover }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                small
                dark
                class="btn-menu"
                color="#000000cb"
                :style="{
                  'background-color': hover ? '#0a69c8d1' : '#000000cb',
                }"
              >
                <v-icon small v-text="title.icon"></v-icon>
                {{ title.text }}
              </v-btn>
            </v-hover>
          </template>

          <v-card class="color-label-card">
            <v-card-title class="color-label-title"
              >Modifier le titre</v-card-title
            >
            <v-divider></v-divider>
            <div v-if="titleIsEmpty">
              <v-alert
                dismissible
                v-model="titleIsEmpty"
                @click="titleIsEmpty = false"
                dense
                icon="mdi-alert-outline"
                type="warning"
              >
                Merci d'indiquer un titre
              </v-alert>
            </div>
            <v-text-field
              v-model="titleUpdated"
              filled
              dense
              clearable
              :placeholder="list.title"
              @keydown.enter.exact.prevent="updateTitle(titleUpdated)"
              data-no-dragscroll
            ></v-text-field>
            <div class="text-center">
              <v-btn class="ma-1" small plain text @click.stop="cancel()"
                >Annuler</v-btn
              >
              <v-btn
                class="ma-1"
                small
                color="primary"
                @click.prevent="updateTitle(titleUpdated)"
                >Enregistrer</v-btn
              >
            </div>
          </v-card>
        </v-menu>
        <v-hover v-slot="{ hover }">
          <v-btn
            small
            dark
            color="#000000cb"
            :style="{ 'background-color': hover ? '#0a69c8d1' : '#000000cb' }"
            @click.stop="removeList(listId)"
          >
            <v-icon small v-text="deleteList.icon"></v-icon>
            {{ deleteList.text }}
          </v-btn>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data: () => ({
    title: { text: "Modifier le titre", icon: "mdi-pencil-outline" },
    deleteList: { text: "Supprimer cette liste", icon: "mdi-trash-can-outline" },
    inputTitleMenu: false,
    titleUpdated: "",
    titleIsEmpty: false
  }),
  props: {
    listId: {
      type: String,
      require: true,
    },
    list: {
      type: Object,
      require: true,
    },
  },
  mounted() {
    this.titleUpdated = this.list.title;
  },
  methods: {
    updateTitle(titleUpdated) {
      if (!titleUpdated) {
        this.titleUpdated = this.list.title;
        this.titleIsEmpty = true;
        setTimeout(() => {
          this.titleIsEmpty = false;
        }, 5000);
      } else {
        this.list.title = titleUpdated;
        this.$store.dispatch("boardLists/updateList", this.list);
        this.inputTitleMenu = false;
      }
    },
    cancel() {
      this.titleUpdated = this.list.title;
      this.inputTitleMenu = false;
    },
    removeList(id) {
      this.$emit("remove-list", id);
    },
    closeMenu() {
      this.$emit("close-menu");
    },
  },
};
</script>
<style scoped>
.modal-header {
  position: absolute;
  z-index: 2;
  height: 0;
  right: 0;
}
.row-buttons {
  overflow: hidden;
  width: 230px !important;
}
.color-label-card {
  width: 300px;
  padding: 0 15px 25px !important;
}
.color-label-title {
  display: block !important;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  padding: 5px;
  text-align: center;
  color: #263859;
}
.v-divider {
  margin-bottom: 20px;
}
.v-system-bar {
  cursor: pointer;
  height: 30px !important;
  border-radius: 3px;
  margin-bottom: 5px !important;
  transition: all .1s ease-in-out;
}
.v-system-bar:hover {
  transition-duration: 0.2s;
  transform: scale(0.9);
  opacity: 0.8;
}
.v-icon {
  padding-right: 10px;
}
.v-icon:hover {
  background-color: transparent !important;
  background: none !important;
}
.v-btn {
  text-transform: none;
  font-size: 13px;
  padding-right: 15px !important;
  margin-bottom: 5px;
}
.v-btn:hover {
  border-radius: 5px;
  -webkit-transform: translateX(5px);
  transform: translateX(5px);
  background-color: #0a69c8d1;
}
.v-sheet.v-list {
  border-radius: 5px;
}
.close-icon {
  color: white !important;
  padding-bottom: 5px !important;
}
.close-icon:hover {
  transition-duration: 0.2s;
  transform: scale(1.2);
  color: #156ef5 !important;
}
</style>
