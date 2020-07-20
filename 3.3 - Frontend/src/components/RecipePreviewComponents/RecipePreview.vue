<template>
  <div>
    <div>
      <b-card :title="recipe.title" tag="article" class="mb-2" :style="style">
        <router-link
          :to="{
            name: 'recipe',
            params: { type: 'api', recipeId: recipe.id },
          }"
        >
          <b-card
            :to="{
              name: 'recipe',
              params: { type: 'api', recipeId: recipe.id },
            }"
            :img-src="recipe.image"
            img-alt="Image"
            img-top
          >
          </b-card>
        </router-link>
        <b-card-text class="bcard-text">
          <ul class="recipe-overview">
            <li>
              <div style="float: left;">
                <img
                  src="../../../resources/clock.png"
                  width="20"
                  height="20"
                />
              </div>
              <div style="float: left;">
                Ready in {{ recipe.readyInMinutes }} minutes
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li>
              <div style="float: left;">
                <img
                  src="../../../resources/likes.jpg"
                  width="20"
                  height="20"
                />
              </div>
              <div style="float: left;">
                Rating: {{ recipe.aggregateLikes }} likes
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li>
              <div style="float: left;">
                <img
                  src="../../../resources/vegetarian.png"
                  width="20"
                  height="20"
                />
              </div>
              <div style="float: left;">
                Vegetarian: {{ recipe.vegetarian ? "Yes" : "No" }}
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li>
              <div style="float: left;">
                <img
                  src="../../../resources/vegan.png"
                  width="20"
                  height="20"
                />
              </div>
              <div style="float: left;">
                Vegan: {{ recipe.vegan ? "Yes" : "No" }}
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li>
              <div style="float: left;">
                <img
                  src="../../../resources/glutenFree.png"
                  width="20"
                  height="20"
                />
              </div>
              <div style="float: left;">
                Gluten free: {{ recipe.glutenFree ? "Yes" : "No" }}
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li v-if="$root.store.username">
              <div style="float: left;">
                <img
                  src="../../../resources/watched.png"
                  width="20"
                  height="20"
                />
              </div>
              <div style="float: left;">
                Watched: {{ recipe.watchedBefore ? "Yes" : "No" }}
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li v-if="$root.store.username">
              <div style="float: left;">
                <button class="clickable" @click="saveFavorite">
                  <img
                    src="../../../resources/favorite.png"
                    width="12"
                    height="12"
                  />
                </button>
              </div>
              <div style="float: left;">
                Favorite: {{ recipe.savedInFavorites ? "Yes" : "No" }}
              </div>
              <div style="float: none; clear: both;"></div>
            </li>
          </ul>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    },
    recipeUserAdd: {
      type: Object,
      required: false,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  methods: {
    async saveFavorite() {
      if (this.$root.store.username) {
        try {
          let response = this.axios.post(
            `http://localhost:3030/user/saveFavoriteRecipe`,
            {
              recipeID: this.recipe.id,
            }
          );
          this.recipe.savedInFavorites = true;
          //updates the watched before of the clicked recipe in the last search results
          if (this.$root.store.searchLastResults) {
            let lastRecipes = JSON.parse(this.$root.store.searchLastResults);
            for (let i = 0; i < Object.keys(lastRecipes).length; i++) {
              if (lastRecipes[i].id == this.recipe.id) {
                lastRecipes[i].savedInFavorites = true;
                this.$root.store.setLastSearch(lastRecipes);
                return;
              }
            }
          }
        } catch (error) {
          console.log(error);
          this.$router.replace("/NotFound");
        }
      } else {
        window.alert("Login first.");
      }
    },
    indicateHover(img) {
      img.style.border = "solid";
    },
  },
  computed: {
    style() {
      return (
        "max-width: " + this.width + "rem; min-height: " + this.height + "rem;"
      );
    },
  },
};
</script>

<style scoped>
.recipe-preview {
  display: inline-block;
  width: 90%;
  height: 100%;
  position: relative;
  margin: 10px 10px;
}

.recipe-preview > .recipe-body {
  width: 100%;
  height: 200px;
  position: relative;
}

.recipe-preview .recipe-body .recipe-image {
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  display: block;
  width: 98%;
  height: auto;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  background-size: cover;
}

.recipe-preview .recipe-footer {
  width: 100%;
  height: 50%;
  overflow: hidden;
}

.recipe-preview .recipe-footer .recipe-title {
  padding: 10px 10px;
  width: 100%;
  font-size: 12pt;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}

.recipe-preview .recipe-footer ul.recipe-overview {
  padding: 5px 10px;
  width: 100%;
  display: -webkit-box;
  display: -moz-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -o-box-flex: 1;
  box-flex: 1;
  -webkit-flex: 1 auto;
  -ms-flex: 1 auto;
  flex: 1 auto;
  table-layout: fixed;
  margin-bottom: 0px;
}

.recipe-preview .recipe-footer ul.recipe-overview li {
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  -o-box-flex: 1;
  -ms-box-flex: 1;
  box-flex: 1;
  -webkit-flex-grow: 1;
  flex-grow: 1;
  width: 90px;
  display: table-cell;
  text-align: center;
}

ul {
  list-style-type: none;
}

.bcard-text {
  margin-left: -35px !important;
}

.clickable {
  border: none;
}
.clickable:hover {
  border: solid;
}
.clickable:focus {
  outline: none;
}
</style>
