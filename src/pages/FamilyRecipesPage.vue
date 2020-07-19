<template>
  <div class="container">
    <b-overlay :show="modalShow" rounded="sm" spinner-variant="success">
      <template v-slot:overlay>
        <div class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Please wait...</p>
        </div>
      </template>
      <special-recipe-preview-list
        :recipes="recipes"
        recipesType="familyRecipes"
      />
    </b-overlay>
  </div>
</template>

<script>
import SpecialRecipePreviewList from "../components/RecipePreviewComponents/SpecialRecipePreviewList";
export default {
  components: {
    "special-recipe-preview-list": SpecialRecipePreviewList,
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
        `http://localhost:3030/user/MyFamilyRecipes`
      );

      //set results
      this.recipes = Object.keys(response.data).map((recipeID) => {
        return {
          id: recipeID,
          image: response.data[recipeID].image,
          title: response.data[recipeID].title,
          readyInMinutes: response.data[recipeID].readyInMinutes,
          aggregateLikes: response.data[recipeID].aggregateLikes,
          vegetarian: response.data[recipeID].egetarian,
          vegan: response.data[recipeID].vegan,
          glutenFree: response.data[recipeID].glutenFree,
          author: response.data[recipeID].author,
          whenAcceptable: response.data[recipeID].whenAcceptable,
        };
      });
    } catch (error) {
      this.$router.replace("/NotFound");
    }
    this.modalShow = false;
  },
  beforeCreate() {
    document.body.className = "familyRecipes";
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
