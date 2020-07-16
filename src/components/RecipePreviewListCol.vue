<template>
  <b-container>
    <h3 class="title">
      {{ title }}
      <slot></slot>
    </h3>
    <b-col v-if="recipes.length > 0">
      <b-col v-for="r in recipes" :key="r.key">
        <RecipePreview class="recipePreview" :recipe="r" :width="20" :height="20" />
      </b-col>
    </b-col>
    <b-col v-else>
      <div>
        <h1> <span class="badge badge-secondary">No recipes to show</span></h1>
      </div>
    </b-col>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: true
    },
    recipes: Array
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}
.title {
    font-family: Sriracha;
    font-size: 40px;
    color: white;
    width: 100%;
}

</style>
