<template>
  <div>
    <v-list v-if="!menuStatus" dense>
      <v-row class="pa-3" justify="center">
        <v-col align="center"
          ><div class="img-card" :style="photosThumbnail" @click.stop="changePhoto(title.photo)">
            <span>{{ title.photo }}</span>
          </div></v-col
        >
        <v-col align="center">
          <div class="color-card" @click.stop="changeColor(title.color)">
            <span>{{ title.color }}</span>
          </div>
        </v-col>
      </v-row>
    </v-list>
  </div>
</template>
<script>

export default {
  name: "SideMenuChangeBg",
  data() {
    return {
      menuClosed: true,
      title: {
        color: "Couleurs",
        photo: "Photos"
      },
      photosThumbnail: { backgroundImage: "url(/photos-thumbnail.jpg)" },
    };
  },
  computed: {
    menuStatus() {
      return this.$store.getters['sideMenu/getMenuStatus'];
    },
  },
  methods: {
    changeColor(title) {
      this.$emit("change-color");
      this.updateTitle(title);
    },
    changePhoto(title) {
      this.$emit("change-photo");
      this.updateTitle(title);
    },
    updateTitle(title) {
      this.$emit("update-title", title);
    }
  },
};
</script>
<style scoped>
span {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
  color: #333;
  background-color: white;
  padding: 5px 10px;
  font-size: 20px;
  opacity: 0.8;
  border-radius: 3px;
  font-weight: bold;
}
.img-card {
  width: 180px;
  height: 120px;
  line-height: 120px;
  background-size: cover;
  border-radius: 10px;
  opacity: 0.8;
  -webkit-transition: opacity 0.2s ease-in-out;
  -moz-transition: opacity 0.2s ease-in-out;
  -ms-transition: opacity 0.2s ease-in-out;
  -o-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
}
.img-card:hover {
  opacity: 1;
}
.color-card {
  width: 180px;
  height: 120px;
  line-height: 120px;
  border-radius: 10px;
  background-color: #00dbde;
  background-image: linear-gradient(90deg, #00dbde 0%, #fc00ff 100%);
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
</style>
