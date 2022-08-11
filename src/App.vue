<template>
  <v-app>
    <v-content>
      <v-container
        fluid
        fill-height
        align-start
        class="bgPhoto"
        :style="getLastUserSelection === 'photo' || !getLastUserSelection ? { backgroundImage: bgPhoto ? 'url(' + bgPhoto + ')' :  'url(' + defaultBgImg + ')'} : { 'background-color': bgColor ? bgColor : '#FAFAFA' }"
      >
        <home-view />
        <v-main>
          <router-view />
        </v-main>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import HomeView from "@/views/HomeView";

export default {
  name: "App",
  components: {
    HomeView,
  },

  data: () => ({
    defaultBgImg: `https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzNTQzMDh8MHwxfHNlYXJjaHwzfHxjb2RlfGVufDB8fHx8MTY2MDIyMDA5MQ&ixlib=rb-1.2.1&q=80`
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
};
</script>
<style scoped>
.bgPhoto {
  background: no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>
