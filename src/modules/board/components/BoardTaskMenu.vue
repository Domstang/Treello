<template>
  <div>
    <v-icon @click="closeModal" class="close-icon">mdi-close</v-icon>
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
              :placeholder="card.title"
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

        <v-menu offset-y>
          <template v-slot:activator="{ attrs, on }">
            <v-hover v-slot="{ hover }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                small
                class="btn-menu"
                dark
                color="#000000cb"
                :style="{
                  'background-color': hover ? '#0a69c8d1' : '#000000cb',
                }"
              >
                <v-icon small v-text="label.icon"></v-icon>
                {{ label.text }}
              </v-btn>
            </v-hover>
          </template>

          <v-card class="color-label-card">
            <v-card-title class="color-label-title">Étiquettes</v-card-title>
            <v-divider></v-divider>
            <div v-for="labelColor in labelColors" :key="labelColor.value">
              <v-system-bar
                dark
                :color="labelColor.value"
                @click.stop="addLabel(labelColor.value)"
              ></v-system-bar>
            </div>
          </v-card>
        </v-menu>

        <v-hover v-slot="{ hover }">
          <v-btn
            small
            dark
            class="btn-menu"
            color="#000000cb"
            :style="{ 'background-color': hover ? '#0a69c8d1' : '#000000cb' }"
            @click.stop="removeAlert = true"
          >
            <v-icon small v-text="deleteTask.icon"></v-icon>
            {{ deleteTask.text }}
          </v-btn>
        </v-hover>
      </v-col>
    </v-row>
    <div v-if="removeAlert">
      <v-alert type="info">
        Êtes-vous sûr de vouloir supprimer cette carte ? Cette action est
        définitive !
        <div class="text-center mt-3">
          <v-btn class="ma-1" small plain text @click.stop="removeAlert = false"
            >Annuler</v-btn
          >
          <v-btn
            class="ma-1"
            small
            color="error"
            @click.prevent="removeTask(cardUniqueId)"
            >Supprimer</v-btn
          >
        </div>
      </v-alert>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    labelColors: [
      { text: "green", value: "#61BD4F" },
      { text: "yellow", value: "#F2D600" },
      { text: "orange", value: "#FF9F1A" },
      { text: "red", value: "#EB5A46" },
      { text: "purple", value: "#C377E0" },
      { text: "blue", value: "#0079BF" },
    ],
    title: { text: "Modifier le titre", icon: "mdi-pencil-outline" },
    label: { text: "Modifier l'étiquette", icon: "mdi-tag-outline" },
    deleteTask: { text: "Supprimer la tâche", icon: "mdi-trash-can-outline" },
    inputTitleMenu: false,
    titleUpdated: "",
    titleIsEmpty: false,
    removeAlert: false,
    updateTitleAlert: false,
  }),
  props: {
    cardUniqueId: {
      type: String,
      require: true,
    },
    card: {
      type: Object,
      require: true,
    },
  },
  mounted() {
    this.titleUpdated = this.card.title;
  },
  methods: {
    updateTitle(titleUpdated) {
      if (!titleUpdated) {
        this.titleUpdated = this.card.title;
        this.titleIsEmpty = true;
        setTimeout(() => {
          this.titleIsEmpty = false;
        }, 5000);
      } else {
        this.card.title = titleUpdated;
        this.$store.dispatch("boardTasks/updateTask", this.card);
        this.inputTitleMenu = false;
      }
    },
    cancel() {
      this.titleUpdated = this.card.title;
      this.inputTitleMenu = false;
    },
    addLabel(color) {
      this.$emit("add-label-color", { color: color, id: this.cardUniqueId });
    },
    removeTask(id) {
      this.$emit("remove-task", id);
    },
    closeModal() {
      this.$emit("close-modal");
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
  width: 210px !important;
}
.color-label-card {
  width: 300px;
  padding: 0 15px 25px !important;
}
.color-label-title {
  display: block !important;
  font-family: "Roboto", sans-serif;
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
  transition: all 0.1s ease-in-out;
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
.btn-menu {
  text-transform: none;
  font-size: 13px;
  padding-right: 15px !important;
  margin-bottom: 5px;
}
.btn-menu:hover {
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
