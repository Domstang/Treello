<template>
  <v-row no-gutters justify="space-between">
    <v-col>
      <v-card class="pa-2" outlined tile> First col
      </v-card>
    </v-col>
    <v-col>
      <side-menu-view />
    </v-col>
  </v-row>
</template>

<script>
import SideMenuView from "@/sideMenu/SideMenuView";

export default {
  components: {
    SideMenuView,
  },
  computed: {},
};
</script>
<style scoped>

</style>
