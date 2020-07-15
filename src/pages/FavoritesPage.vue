<template>
  <div class="container">
    <b-overlay :show="modalShow" rounded="sm" spinner-variant="success">
      <template v-slot:overlay>
        <div class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Please wait...</p>
        </div>
      </template>
      <special-recipe-preview :recipes="recipes" />
    </b-overlay>
  </div>
</template>

<script>
import SpecialRecipePreviewList from "../components/SpecialRecipePreviewList";
export default {
  components: {
    "special-recipe-preview": SpecialRecipePreviewList,
  },
  data() {
    return {
      recipes: [],
      modalShow: false,
    };
  },
  async created() {
    this.modalShow = true;
    if (this.$root.store.username) {
    } else {
      this.$router.push("/notFound");
    }

    try {
      let response = await this.axios.get(
        `http://localhost:3000/user/MyFavorites`
      );

      let recipesPreview = await this.axios.get(
        `http://localhost:3000/recipes/recipePreview/[${Object.keys(
          response.data
        )}]`
      );
      //set results
      this.recipes = Object.keys(response.data).map((recipeID) => {
        return {
          id: recipeID,
          image: recipesPreview.data[recipeID].image,
          title: recipesPreview.data[recipeID].title,
          readyInMinutes: recipesPreview.data[recipeID].readyInMinutes,
          aggregateLikes: recipesPreview.data[recipeID].aggregateLikes,
          vegetarian: recipesPreview.data[recipeID].egetarian,
          vegan: recipesPreview.data[recipeID].vegan,
          glutenFree: recipesPreview.data[recipeID].glutenFree,
          watchedBefore: response.data[recipeID].watchedBefore,
          savedInFavorites: response.data[recipeID].savedInFavorites,
        };
      });
    } catch (error) {
      this.$router.replace("/NotFound");
    }
    this.modalShow = false;
  },
  beforeCreate() {
    document.body.className = "favorites";
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0px;
  background-color: rgba(255, 255, 255, 0.7);
  width: 1000px;
  min-height: 700px;
}
</style>
