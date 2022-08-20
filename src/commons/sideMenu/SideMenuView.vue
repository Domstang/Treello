<template>
  <v-card class="my-8" :class="menuStatus ? 'toggle-before' : 'toggle-resize'" outlined elevation="2">
    <side-menu-header
      @reset-menu="resetMenu"
      @go-start="goStart"
      :title="title"
      :colors="colors"
      :photos="photos"
    />
    <side-menu-change-bg
      @change-color="changeColor"
      @change-photo="changePhoto"
      @update-title="updateTitle"
      v-if="!colors && !photos"
    />
    <side-menu-photos v-if="photos" />
    <side-menu-colors v-if="colors" />
  </v-card>
</template>
<script>
import SideMenuHeader from "@/commons/sideMenu/components/SideMenuHeader";
import SideMenuChangeBg from "@/commons/sideMenu/components/SideMenuChangeBg";
import SideMenuColors from "@/commons/sideMenu/components/SideMenuColors";
import SideMenuPhotos from "@/commons/sideMenu/components/SideMenuPhotos";

export default {
  components: {
    SideMenuHeader,
    SideMenuChangeBg,
    SideMenuColors,
    SideMenuPhotos,
  },

  data() {
    return {
      colors: false,
      photos: false,
      title: "",
      defaultTitle: "Changer de fond d'écran",
    };
  },
  computed: {
    menuStatus() {
      return this.$store.getters["sideMenu/getMenuStatus"];
    },
  },
  mounted() {
    this.setTitle();
  },
  methods: {
    setTitle() {
      this.title = this.defaultTitle;
    },
    goStart() {
      this.colors = false;
      this.photos = false;
      this.setTitle();
    },
    changeColor() {
      this.colors = true;
      this.photos = false;
    },
    changePhoto() {
      this.photos = true;
      this.colors = false;
    },
    resetMenu() {
      this.colors = false;
      this.photos = false;
      this.setTitle();
    },
    updateTitle(value) {
      this.title = value;
    },
    closeSideMenu() {
      this.resetMenu();
      this.$store.dispatch("sideMenu/sideMenuStatus", true);
    },
  },
};
</script>
<style scoped>
.toggle-before {
  float: right;
}
.toggle-resize {
  float: right;
  width: 450px;
}
</style>
