<template>
  <v-app>
    <nav-bar />
    <v-container
      fluid
      fill-height
    >
      <v-main>
        <router-view />
      </v-main>
    </v-container>
  </v-app>
</template>

<script>
import NavBar from '@/commons/NavBar.vue'

export default {
  name: "App",
  components: {
    NavBar
  },

  data: () => ({}),
  computed: {},
  mounted() {},
};
</script>
<style scoped>
.v-main {
  height: 100%;
  padding: 0 !important;
  margin: 0 !important;
}
.container {
  padding: 0 !important;
  padding: 0 !important;
  background-color: #cdcdcd;
}
</style>
