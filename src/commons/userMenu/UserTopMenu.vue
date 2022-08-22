<template>
  <v-col>
    <v-menu v-model="menu" offset-y :close-on-click="closeOnClick" :close-on-content-click="closeOnContentClick">
      <template v-slot:activator="{ attrs, on }">
        <v-avatar size="36" v-bind="attrs" v-on="on" color="blue">
          <span class="white--text text-h7">{{ userFirstLetter }}</span>
        </v-avatar>
      </template>
      <v-card class="mt-2" width="200px">
        <v-system-bar color="white" class="py-4">
          <v-spacer></v-spacer>
          <v-icon @click="menu = false" size="22" right>mdi-close</v-icon>
        </v-system-bar>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item-group>
            <v-list-item>
              <v-list-item-icon class="mr-3">
                <v-icon>mdi-view-list</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title :to="{ name: 'Board' }"
                  >Board</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon class="mr-3">
                <v-icon>mdi-logout-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title @click="logout"
                  >Se déconnecter</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-menu>
  </v-col>
</template>
<script>
export default {
  props: {
    currentUserName: {
      type: String,
      requied: true,
    },
    isLoggedIn: {
      type: Boolean,
      requied: true,
    },
  },
  computed: {
    userFirstLetter() {
      return this.currentUserName.charAt(0).toUpperCase();
    },
  },
  data: () => ({
    closeOnClick: false,
    closeOnContentClick: false,
    menu: false,
  }),
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$emit("logout")
    },
  },
};
</script>
<style scoped>
.v-menu__content {
  box-shadow: none !important;
}
</style>
