<template>
  <v-row
    align="start"
    justify="start"
    class="bgPhoto pt-8"
    :style="
      getLastUserSelection === 'photo' || !getLastUserSelection
        ? {
            backgroundImage: bgPhoto
              ? 'url(' + bgPhoto + ')'
              : 'url(' + defaultBgImg + ')',
          }
        : { 'background-color': bgColor ? bgColor : '#FAFAFA' }
    "
  >
    <board />
    <div class="side-menu"><side-menu-view /></div>
  </v-row>
</template>

<script>
import SideMenuView from "@/commons/sideMenu/SideMenuView";
import Board from "@/modules/board/components/BoardCard";

export default {
  components: {
    SideMenuView,
    Board,
  },
  data: () => ({
    defaultBgImg: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNTQzMDh8MHwxfHNlYXJjaHwzfHxjb2RlfGVufDB8fHx8MTY2MDIyMDA5MQ&ixlib=rb-1.2.1&q=80`,
  }),
  computed: {
    bgColor() {
      return this.$store.getters["sideMenu/getBgColor"];
    },
    bgPhoto() {
      return this.$store.getters["sideMenu/getBgPhoto"];
    },
    getLastUserSelection() {
      return this.$store.getters["sideMenu/getLastUserSelection"];
    },
  },
  methods: {},
};
</script>
<style scoped>
.bgPhoto {
  height: 100%;
  background: no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.side-menu {
  position: absolute;
  top: 67px;
  right: 20px;
}
</style>
