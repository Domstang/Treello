<template>
<v-container >
  <v-app-bar app color="rgba(232, 232, 232, 0.700)" dense flat>
      <v-row align="center" justify="space-between">
        <v-col>
          <v-btn to="/" text>Trello</v-btn>
        </v-col>
        <v-spacer></v-spacer>
        <v-col align="right">
          <div v-if="!isLoggedIn">
            <v-btn :to="{ name: 'Login' }" text>Login</v-btn>
            <v-btn :to="{ name: 'Register' }" text>Register</v-btn>
          </div>
          <div v-else>
            <!-- {{ currentUserName }}
            <v-btn :to="{ name: 'Board' }" text>Board</v-btn>
            <v-btn @click="logout" text>Logout</v-btn> -->
            <user-top-menu :isLoggedIn="isLoggedIn" :currentUserName="currentUserName"/>
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
  mounted() {
    let auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.currentUserName = auth.currentUser.displayName;
      } else {
        this.isLoggedIn = false;
        this.currentUserName = "";
      }
    });
  },
}
</script>
<style scoped>
  
</style>