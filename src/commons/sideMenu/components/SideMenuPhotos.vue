<template>
  <div>
    <v-list v-if="!menuStatus" dense>
      <v-form @submit.prevent="searchPhotos(userInput)">
        <v-row>
          <v-col>
            <v-text-field
              outlined
              clearable
              label="Photos"
              prepend-inner-icon="mdi-magnify"
              class="px-8 pt-4"
              v-model="userInput"
              :append-outer-icon="userInput ? 'mdi-send' : ''"
              @click:append-outer="searchPhotos(userInput)"
              @click:clear="clearResults"
            >
              ></v-text-field
            >
          </v-col>
        </v-row>
      </v-form>
      <v-row :class="result.length > 0 ? 'block-photos-search px-7 pt-0 pb-5' : 'block-photos px-7 pt-0 pb-5'">
        <v-col
          v-for="photo in searchForPhotos"
          :key="photo.urls.thumb"
          align="center"
        >
          <v-hover v-slot="{ hover }">
            <v-img
              class="color-card"
              :src="photo.urls.thumb"
              :loading="isLoading"
              width="180px"
              @click.stop="updateBgPhoto(photo.urls.regular)"
            >
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="creditPhoto v-card--reveal text-caption white--text pt-1"
                  style="height: 25%"
                >
                  <a
                    class="author-link"
                    :href="photo.user.links.html"
                    target="_blank"
                  >
                    © {{ photo.user.name }}
                  </a>
                </div>
              </v-expand-transition>
            </v-img>
          </v-hover>
        </v-col>
        <v-row v-if="result.length >= 10">
          <v-col align="center" class="py-7">
            <v-btn depressed color="primary" @click.stop="loadMore">Plus</v-btn>
          </v-col>
        </v-row>
      </v-row>
    </v-list>
  </div>
</template>
<script>
import { createApi } from "unsplash-js";
const unsplash = new createApi({
  accessKey: "LtTLScGhMOm2N-QUjo4jAV5Tf3_-5AOQQJsTKHFSqtQ",
});
export default {
  name: "SideMenuChangeColors",
  data: () => ({
    isLoading: false,
    menuClosed: true,
    colors: {
      blue: "#3CA5E1",
    },
    userInput: "",
    photos: [],
    result: [],
    currentPage: 1,
    query: "",
    accessKey: "LtTLScGhMOm2N-QUjo4jAV5Tf3_-5AOQQJsTKHFSqtQ",
    collectionUrl: "https://api.unsplash.com/collections/23/photos",
    searchPhotosUrl: "https://api.unsplash.com/search/photos",
  }),
  computed: {
    menuStatus() {
      return this.$store.getters["sideMenu/getMenuStatus"];
    },
    searchForPhotos() {
      return this.result.length > 0 ? this.result : this.photos;
    },
    getUserSettings() {
      return this.$store.getters["sideMenu/getUserSettings"];
    }
  },
  async mounted() {
    this.fetchCollectionPhoto();
  },
  created() {
    
  },
  methods: {
    updateBgPhoto(userChoice) {
      let userBg = { 'background': userChoice , 'type': 'photo' }
      if(this.getUserSettings.background) {
        this.$store.dispatch("sideMenu/updateBackground", userBg);
      } else {
        this.$store.dispatch("sideMenu/addBg", userBg);
      }
    },
    async fetchCollectionPhoto() {
      await fetch(this.collectionUrl + `?client_id=${this.accessKey}`)
        .then((response) => response.json())
        .then((json) => {
          let arr = json;
          let self = this;
          arr.forEach(function (obj) {
            self.photos.push(obj);
          });
        })
        .catch((err) => {
          console.log("err : ", err);
        });
    },
    async searchPhotos(userInput) {
      this.result = [];
      const result = await unsplash.search.getPhotos({
        query: userInput,
        orientation: 'landscape',
        perPage: 10,
      });
      if (result.status === 200) {
        this.result = result.response.results;
        this.currentPage++;
        this.query = userInput;
      }
    },
    async loadMore() {
      const result = await unsplash.search.getPhotos({
        query: this.query,
        perPage: 10,
        page: this.currentPage,
      });
      if (result.status === 200) {
        result.response.results.forEach((item) => {
          this.result.push(item);
        });
        this.currentPage++;
      }
    },
    clearResults() {
      this.result = [];
    },
  },
};
</script>
<style scoped>
.author-link {
  color: #222;
  text-decoration: none;
  font-size: 14px;
}
.block-photos {
  margin-top: -30px;
}
.block-photos-search {
  margin-top: -30px;
  height: 800px;
  margin-bottom: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  align-content: start;
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
.creditPhoto {
  background-color: #fff;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.7;
  position: absolute;
  width: 100%;
  -webkit-transition: opacity 0.2s ease-in-out;
  -moz-transition: opacity 0.2s ease-in-out;
  -ms-transition: opacity 0.2s ease-in-out;
  -o-transition: opacity 0.2s ease-in-out;
  transition: opacity 0.2s ease-in-out;
}
.v-card--reveal:hover {
  opacity: 0.9;
}
</style>
