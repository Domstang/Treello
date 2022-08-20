<template>
  <div>
    <v-list v-if="!menuStatus" dense>
      <v-row class="pa-7">
        <v-col v-for="color in colors" :key="color" align="center"
          ><div
            class="color-card"
            :style="{ 'background-color': color }"
            @click.stop="updateBgColor(color)"
          ></div
        ></v-col>
        <v-col align="center"
          ><div
            class="color-card"
            :style="{ 'background-color': '#dedede' }"
            @click.stop="updateBgColor(resetColor.grey)"
          ></div
        ></v-col>
        <v-col align="center"
          ><div
            class="color-card color-edit"
            v-if="!editColor"
            @click.stop="editColor = true"
          ><v-icon class="icon">choose</v-icon></div
        ></v-col>
      </v-row>
      <v-row>
        <v-col align="center">
          <v-color-picker
            v-click-outside="onClickOutside"
            class="color-picker"
            v-if="editColor"
            elevation="10"
            dot-size="15"
            hide-inputs
            mode="hexa"
            swatches-max-height="100"
            v-model="colorPicker"
            :click-dot="updateBgColor(colorPicker)"
          >
          </v-color-picker>
        </v-col>
      </v-row>
    </v-list>
  </div>
</template>
<script>
export default {
  name: "SideMenuChangeColors",
  data() {
    return {
      menuClosed: true,
      colorPicker: "#1197E4",
      editColor: false,
      colors: {
        red: "#E83d3A",
        blue: "#3CA5E1",
        pink: "#CD5A91",
        green: "#4BBF6B",
        purple: "#89609E",
        orange: "#EAb56A",
        nightBlue: "#1f1a3b",
      },
      resetColor: {
        grey: "#FAFAFA",
      },
    };
  },
  computed: {
    menuStatus() {
      return this.$store.getters["sideMenu/getMenuStatus"];
    },
    getUserSettings() {
      return this.$store.getters["sideMenu/getUserSettings"];
    }
  },
  methods: {
    updateBgColor(userChoice) {
      let userBg = { 'background': userChoice , 'type': 'color' }
      if(this.getUserSettings.background) {
        this.$store.dispatch("sideMenu/updateBackground", userBg);
      } else {
        this.$store.dispatch("sideMenu/addBg", userBg);
      }
    },
    onClickOutside() {
      this.editColor = false;
    }
  },
};
</script>
<style scoped>
.icon {
  font-size: 30px;
  text-decoration: underline;
  color: #fff;
  opacity: 0.8;
}
.icon:hover {
  opacity: 1;
}
.color-picker {
  margin-top: -20px;
  margin-bottom: 30px;
}
.color-card {
  width: 180px;
  height: 120px;
  line-height: 120px;
  border-radius: 10px;
  -webkit-transition: opacity 0.2s ease-in-out;
  -moz-transition: opacity 0.2s ease-in-out;
  -ms-transition: opacity 0.2s ease-in-out;
  -o-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
  opacity: 0.8;
  cursor: pointer;
}
.color-card:hover {
  opacity: 1;
}
.color-edit {
  opacity: 0.8;
  background: rgb(20, 151, 230);
  background: -moz-linear-gradient(
    42deg,
    rgba(20, 151, 230, 1) 0%,
    rgba(131, 58, 180, 1) 25%,
    rgba(253, 29, 29, 1) 50%,
    rgba(252, 176, 69, 1) 75%,
    rgba(252, 219, 69, 1) 100%
  );
  background: -webkit-linear-gradient(
    42deg,
    rgba(20, 151, 230, 1) 0%,
    rgba(131, 58, 180, 1) 25%,
    rgba(253, 29, 29, 1) 50%,
    rgba(252, 176, 69, 1) 75%,
    rgba(252, 219, 69, 1) 100%
  );
  background: linear-gradient(
    42deg,
    rgba(20, 151, 230, 1) 0%,
    rgba(131, 58, 180, 1) 25%,
    rgba(253, 29, 29, 1) 50%,
    rgba(252, 176, 69, 1) 75%,
    rgba(252, 219, 69, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#1497e6",endColorstr="#fcdb45",GradientType=1);
}
.color-edit:hover {
  opacity: 1;
}
</style>
