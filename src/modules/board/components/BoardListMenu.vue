<template>
  <div>
    <v-icon @click="closeMenu" class="close-icon"
      >mdi-close</v-icon
    >
    <v-row class="row-buttons">
      <v-col sm="4">
        <v-hover v-slot="{ hover }">
          <v-btn
            small
            dark
            color="#000000cb"
            :style="{ 'background-color': hover ? '#0a69c8d1' : '#000000cb' }"
          >
            <v-icon small v-text="title.icon"></v-icon>
            {{ title.text }}
          </v-btn>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  data: () => ({
    title: { text: "Supprimer cette liste", icon: "mdi-trash-can-outline" }
  }),
  props: {
    cardUniqueId: {
      type: String,
      require: true,
    },
  },
  methods: {
    removeList(id) {
      this.$emit("remove-task", id);
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
