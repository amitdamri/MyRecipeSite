<template>
  <b-overlay :show="showSpinner" rounded="sm" id="modal">
    <template v-slot:overlay>
      <div class="text-center">
        <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
        <p id="cancel-label">Please wait...</p>
      </div>
    </template>
    <div class="container">
      <div style="float: left;">
        <RecipePreviewListCol
          title="Explore these recipes"
          :recipes="random_recipes"
        />
        <button
          type="button"
          class="btn btn-dark"
          @click="updateRandomRecipes"
          style="margin-left: 45px;"
        >
          Load new recipes
        </button>
      </div>
      <div style="float: right;">
        <RecipePreviewListCol
          v-if="$root.store.username"
          title="Last watched recipes"
          :recipes="last_watched_recipes"
        ></RecipePreviewListCol>
        <login v-else style="margin-top: 50px;"> </login>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import RecipePreviewListCol from "../components/RecipePreviewComponents/RecipePreviewListCol";
import login from "./LoginPage";
export default {
  components: {
    RecipePreviewListCol,
    login,
  },
  data() {
    return {
      random_recipes: [],
      pseudo_watched_recipes: [],
      last_watched_recipes: [],
      showSpinner: false,
    };
  },
  async created() {
    console.log("created");
    this.showSpinner = true;
    await this.updateRandomRecipes();
    if (this.$root.store.username) {
      this.updateWatchedRecipes();
    } else {
      this.showSpinner = false;
    }
  },
  methods: {
    async updateRandomRecipes() {
      try {
        this.axios.defaults.withCredentials = true;
        const response = await this.axios.get(
          "http://localhost:3030/recipes/3RandomRecipes"
        );
        if (this.$root.store.username) {
          let recipesIDs = this.getRecipesIDsAsArray(
            Object.keys(response.data)
          );
          const userAddResponse = await this.axios.get(
            `http://localhost:3030/user/recipePreview/${recipesIDs}`
          );
          return this.getRecipesPreviewUsers(response, userAddResponse);
        }

        return this.getRecipesPreviewGuests(response);
      } catch (error) {
        console.log(error);
      }
    },
    getRecipesPreviewUsers(response, userAddResponse) {
      this.random_recipes = Object.keys(response.data).map((recipeID) => {
        return {
          id: recipeID,
          image: response.data[recipeID].image,
          title: response.data[recipeID].title,
          readyInMinutes: response.data[recipeID].readyInMinutes,
          aggregateLikes: response.data[recipeID].aggregateLikes,
          vegetarian: response.data[recipeID].vegetarian,
          vegan: response.data[recipeID].vegan,
          glutenFree: response.data[recipeID].glutenFree,
          watchedBefore: userAddResponse.data[recipeID].watchedBefore,
          savedInFavorites: userAddResponse.data[recipeID].savedInFavorites,
        };
      });
    },
    getRecipesPreviewGuests(response) {
      this.random_recipes = Object.keys(response.data).map((recipeID) => {
        return {
          id: recipeID,
          image: response.data[recipeID].image,
          title: response.data[recipeID].title,
          readyInMinutes: response.data[recipeID].readyInMinutes,
          aggregateLikes: response.data[recipeID].aggregateLikes,
          vegetarian: response.data[recipeID].vegetarian,
          vegan: response.data[recipeID].vegan,
          glutenFree: response.data[recipeID].glutenFree,
        };
      });
    },
    async updateWatchedRecipes() {
      try {
        const response_userAddition = await this.axios.get(
          "http://localhost:3030/user/last3RecipesWatched"
        );

        const recipesIDs = this.getRecipesIDsAsArray(
          Object.keys(response_userAddition.data)
        );

        const response_recipePreviews = await this.axios.get(
          `http://localhost:3030/recipes/recipePreview/${recipesIDs}`
        );

        this.last_watched_recipes = Object.keys(response_userAddition.data).map(
          (recipeID) => {
            return {
              id: recipeID,
              image: response_recipePreviews.data[recipeID].image,
              title: response_recipePreviews.data[recipeID].title,
              readyInMinutes:
                response_recipePreviews.data[recipeID].readyInMinutes,
              aggregateLikes:
                response_recipePreviews.data[recipeID].aggregateLikes,
              vegetarian: response_recipePreviews.data[recipeID].vegetarian,
              vegan: response_recipePreviews.data[recipeID].vegan,
              glutenFree: response_recipePreviews.data[recipeID].glutenFree,
              watchedBefore: response_userAddition.data[recipeID].watchedBefore,
              savedInFavorites:
                response_userAddition.data[recipeID].savedInFavorites,
            };
          }
        );
        this.showSpinner = false;
      } catch (error) {
        console.log(error);
        this.showSpinner = false;
      }
    },
    getRecipesIDsAsArray(recipesIDs) {
      const recipesIDs_toInt = [];
      recipesIDs.map((id) => recipesIDs_toInt.push(parseInt(id)));
      return encodeURIComponent(JSON.stringify(recipesIDs_toInt));
    },
  },
};
</script>

<style lang="scss" scoped>
.blur {
  -webkit-filter: blur(5px);
  filter: blur(3px);
}
::v-deep .blur .recipe-preview {
  pointer-events: none;
  cursor: default;
}
.isDisabled {
  pointer-events: none;
  cursor: not-allowed;
  text-decoration: none;
}

@font-face {
  font-family: Sriracha;
  src: url("../../resources/Sriracha-Regular.ttf") format("truetype");
}

.container {
  min-height: 700px;
}
.leftCol {
  margin-bottom: 3rem;
}
</style>
