<template>
  <div>
    <v-list-item class="px-2">
      <div v-if="menuStatus">
        <v-btn icon @click.stop="showSideMenu">
          <v-icon>mdi-tune</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-row style="width: 450px" align="center" justify="space-between">
          <v-col align="left">
            <v-btn icon @click.stop="goStart">
              <v-icon v-if="colors || photos">mdi-chevron-left</v-icon></v-btn
            >
          </v-col>
          <v-col cols=8 align="center">
            <div class="title-menu" v-if="!menuStatus">
              {{ title }} <span v-if="photos">d'<a  href="https://unsplash.com/?utm_source=trello_clone&utm_medium=referral" target="_blank">Unsplash</a></span>
            </div></v-col
          >
          <v-col align="right">
            <v-btn icon @click.stop="closeSideMenu">
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-list-item>
    <v-divider v-if="!menuStatus"></v-divider>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuClosed: true,
    };
  },
  props: {
    title: {
      type: String,
      require: true,
    },
    colors: {
      type: Boolean,
      require: true,
    },
    photos: {
      type: Boolean,
      require: true,
    }
  },
  computed: {
    menuStatus() {
      return this.$store.getters["sideMenu/getMenuStatus"];
    },
  },
  methods: {
    showSideMenu() {
      let updateMenuStatus = !this.menuClosed;
      this.$store.dispatch("sideMenu/sideMenuStatus", updateMenuStatus);
    },
    closeSideMenu() {
      let updateMenuStatus = this.menuClosed;
      this.$store.dispatch("sideMenu/sideMenuStatus", updateMenuStatus);
      this.$emit("reset-menu");
    },
    goStart() {
      this.$emit("go-start");
    }
  },
};
</script>
<style scoped>
  a:link, a:visited {
    color: #172B4D;
  }
  .title-menu {
    font-size: 20px;
    font-family: 'Rubik', sans-serif;
    font-weight: 500;
    color: #172B4D
  }
</style>
