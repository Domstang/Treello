<template>
  <v-row class="fill-height" justify="start" align="center">
    <v-col md="6" class="fill-height background">
      <v-img class="logo" src="logo.png"></v-img>
      <v-col class="col-intro" align="center">
        <p class="text-intro">
          Bienvenue sur Treello ! <br />
          Clone du site Trello 😎
        </p>
        <v-row align="start" justify="center" class="logos-technos">
          <v-col>
            <v-tooltip top color="error">
              <template v-slot:activator="{ on, attrs }">
                <div id="logo">
                  <svg
                    v-bind="attrs"
                    v-on="on"
                    height="43"
                    viewBox="0 0 256 221"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMinYMin meet"
                  >
                    <path
                      d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z"
                      fill="#41B883"
                    />
                    <path
                      d="M0 0l128 220.8L256 0h-51.2L128 132.48 50.56 0H0z"
                      fill="#41B883"
                    />
                    <path
                      d="M50.56 0L128 133.12 204.8 0h-47.36L128 51.2 97.92 0H50.56z"
                      fill="#35495E"
                    />
                  </svg>
                </div>
              </template>
              <span>Vue.js</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip top color="error">
              <template v-slot:activator="{ on, attrs }">
                <div id="logo">
                  <svg
                    v-bind="attrs"
                    v-on="on"
                    height="43"
                    enable-background="new 0 0 2187.5 2500"
                    viewBox="0 0 2187.5 2500"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m1093.8 0h-511l511 1208" fill="#1697f6" />
                    <path
                      d="m1093.8 1562.5v937.5l-1093.8-2135.5h573zm0-1562.5h511l-511 1208"
                      fill="#7bc6ff"
                    />
                    <path
                      d="m1614.5 364.5h573l-1093.7 2135.5v-937.5z"
                      fill="#aeddff"
                    />
                  </svg>
                </div>
              </template>
              <span>Vuetify</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip top color="error">
              <template v-slot:activator="{ on, attrs }">
                <div id="logo">
                  <v-img
                    v-bind="attrs"
                    v-on="on"
                    height="43"
                    width="31"
                    src="img/firebase.png"
                  ></v-img>
                </div>
              </template>
              <span>Firebase (Auth / Db / Host)</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-col>
      <v-img class="rocket" src="img/rocket.png"></v-img>
    </v-col>
    <v-col md="4">
      <v-card flat>
        <v-card-title>Connectez-vous pour utiliser Treello</v-card-title>
        <v-card-subtitle class="subtitle">Compte de démo :
          <v-icon size="17" class="mr-1">mdi-email</v-icon><span class="mr-2">{{ defaultEmail }}</span>
          <v-icon size="17" class="mr-1">mdi-lock</v-icon><span>{{ defaultPass }}</span><br>
        </v-card-subtitle>
        <v-btn x-small outlined text color="blue-grey" class="ml-4" @click.prevent="fillForm"><v-icon size="16" class="pr-1">mdi-file-document-edit-outline</v-icon>pré-remplir</v-btn>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Email"
              prepend-inner-icon="mdi-email"
              filled
              required
            >
            </v-text-field>

            <v-text-field
              class="input-pass"
              v-model="password"
              :rules="passwordRules"
              label="Mot de passe"
              filled
              prepend-inner-icon="mdi-lock"
              required
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            >
            </v-text-field>
            <v-btn
              block
              large
              elevation="0"
              color="success"
              @click="login"
              :loading="isLoading"
            >
              Se connecter
            </v-btn>
          </v-form>

          <p class="pt-2">
            Créer un compte ?
            <router-link :to="{ name: 'Register' }">S'enregistrer</router-link>
          </p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      show: false,
      valid: false,
      defaultEmail: "demo@demo.fr",
      defaultPass: "demo1234",
      email: "",
      password: "",
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+/.test(v) || "Email must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 8 || "Password must be 8 characters or more",
      ],
    };
  },
  computed: {},
  methods: {
    login() {
      const valid = this.$refs.form.validate();
      if (valid) {
        this.isLoading = true;
        this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });
      }
    },
    fillForm() {
      this.email = this.defaultEmail;
      this.password = this.defaultPass;
    }
  },
};
</script>
<style scoped>
.v-row {
  height: 100%;
  padding-bottom: 0 !important;
  margin: 0 !important;
}
#logo:hover {
  -webkit-transform: translateY(5px);
  transform: translateY(5px);
}
.background {
  background: rgb(0, 63, 95);
  background: -moz-linear-gradient(
    90deg,
    rgba(0, 63, 95, 1) 0%,
    rgba(0, 104, 178, 1) 500px,
    rgba(0, 104, 178, 1) 10%,
    rgba(255, 255, 255, 1) 10%
  );
  background: -webkit-linear-gradient(
    90deg,
    rgba(0, 63, 95, 1) 0%,
    rgba(0, 104, 178, 1) 500px,
    rgba(0, 104, 178, 1) 10%,
    rgba(255, 255, 255, 1) 10%
  );
  background: linear-gradient(
    90deg,
    rgba(0, 63, 95, 1) 0%,
    rgba(0, 104, 178, 1) 500px,
    rgba(0, 104, 178, 1) 10%,
    rgba(255, 255, 255, 1) 10%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#003f5f",endColorstr="#ffffff",GradientType=1);
}
.logo {
  position: absolute;
  left: 60px;
  top: 30px;
}
.logos-technos {
  cursor: pointer;
  width: 350px;
  padding: 15px 10px 10px 10px;
  margin-top: 20px;
  margin-left: 60px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.259);
}
.rocket {
  position: absolute;
  left: 0;
  bottom: 0;
}
.input-pass{
  margin-bottom: 0 !important;
}
.v-card {
  width: 540px;
}
.v-card__title {
  font-family: "Roboto", sans-serif;
  color: #003c61;
  font-size: 23px;
  font-weight: 600;
}
.text-intro {
  width: 460px;
  font-size: 23px;
  line-height: 27px;
  text-align: center;
  color: rgb(217, 217, 217);
  font-family: "Lato";
}
.col-intro {
  width: 400px;
  padding-top: 150px;
}
</style>
