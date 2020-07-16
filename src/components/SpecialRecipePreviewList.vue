<template>
  <b-container>
    <b-row v-for="r in recipes" :key="r.id">
      <special-recipe-preview
        class="recipePreview"
        :recipe="r"
        :recipeType="recipesType"
      />
    </b-row>
  </b-container>
</template>

<script>
import SpecialRecipePreview from "./SpecialRecipePreview.vue";
export default {
  name: "SpecialRecipePreviewList",
  components: {
    "special-recipe-preview": SpecialRecipePreview,
  },
  props: {
    recipes: {
      type: Array,
      required: true,
    },
    recipesType: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
</style>
