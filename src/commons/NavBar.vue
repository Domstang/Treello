<template>
<v-container >
  <v-app-bar app height="55" color="rgba(2, 25, 37, 0.75)" dense flat>
      <v-row align="center" justify="space-between">
        <v-col>
          <v-img width="100" src="logo.png"></v-img>
        </v-col>
        <v-spacer></v-spacer>
        <v-col align="right">
          <div v-if="!isLoggedIn">
            <v-btn :to="{ name: 'Login' }" text>Se connecter</v-btn>
            <v-btn :to="{ name: 'Register' }" text>S'enregistrer</v-btn>
          </div>
          <div v-else>
            <!-- {{ currentUserName }}
            <v-btn :to="{ name: 'Board' }" text>Board</v-btn>
            <v-btn @click="logout" text>Logout</v-btn> -->
            <user-top-menu :isLoggedIn="isLoggedIn" :currentUserName="currentUserName" @logout="logout"/>
          </div>
        </v-col>
      </v-row>
    </v-app-bar>
  </v-container>
</template>
<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import UserTopMenu from './userMenu/UserTopMenu.vue';

export default {
  components: {
    UserTopMenu
  },
  data: () => ({
    isLoggedIn: false,
    currentUserName: "",
  }),
  computed: {
    getUserProfile() {
      return this.$store.getters.getUserProfile
    },
    getUserName() {
      return this.$store.getters.getUserName
    },
    getIsAuthenticated() {
      return this.$store.getters.getIsAuthenticated ? true : false
    }
  },
  async mounted() {
    /* let auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.currentUserName = auth.currentUser.displayName;
      } else {
        this.isLoggedIn = false;
        this.currentUserName = "";
      }
    });  */
      await this.$store.dispatch('fetchUserProfile')
      this.setUser()
  },
  methods: {
    async setUser() {
      let obj = JSON.parse(localStorage.getItem('userName'));
      console.log("🚀 ~ setUser ~ obj", obj)
      this.isLoggedIn = true;
      let userName = await this.getUserProfile.displayName
      this.currentUserName = userName
    },
    logout() {
      this.isLoggedIn = false;
    }
  }
}
</script>
<style scoped>
  
</style>