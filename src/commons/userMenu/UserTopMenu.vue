<template>
  <v-col>
    <v-menu v-model="menu" offset-y :close-on-click="closeOnClick" :close-on-content-click="closeOnContentClick">
      <template v-slot:activator="{ attrs, on }">
        <v-avatar size="36" v-bind="attrs" v-on="on" color="error">
          <span class="white--text text-h7">{{ userFirstLetter }}</span>
        </v-avatar>
      </template>
      <v-card class="mt-2" width="300px">
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ currentUser.displayName }}</v-list-item-title>
              <v-list-item-subtitle>{{ currentUser.email }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                icon
                @click="menu = false"
              >
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item-group>
            <v-list-item align="start">
              <v-list-item-icon class="mr-3">
                <v-icon>mdi-view-list</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <v-btn :to="{ name: 'Board' }" small plain>Board</v-btn></v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>

            <v-list-item align="start">
              <v-list-item-icon class="mr-3">
                <v-icon>mdi-logout-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  ><v-btn small plain @click="logout">Se déconnecter</v-btn></v-list-item-title
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
    isLoggedIn: {
      type: Boolean,
      requied: true,
    },
  },
  computed: {
    userFirstLetter() {
      return this.getUserProfile.displayName.charAt(0).toUpperCase();
    },
    getUserProfile() {
      return this.$store.getters.getUserProfile
    }
  },
  data: () => ({
    closeOnClick: false,
    closeOnContentClick: false,
    currentUser: {},
    menu: false,
  }),
 async mounted() {
    await this.$store.dispatch('fetchUserProfile')
    this.setUser()
  },
  methods: {
    setUser() {
      this.currentUser =  this.getUserProfile
    },
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
