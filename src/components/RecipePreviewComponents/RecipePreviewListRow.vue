<template>
  <b-container>
    <h3 class="title">
      {{ title }}
      <slot></slot>
    </h3>
    <div v-if="recipes.length > 0">
      <div v-if="recipes.length > 4">
        <b-row v-for="(n, i) in Math.floor(recipes.length / 5)" :key="i">
          <b-col class="col" v-for="(n, j) in 5" :key="j">
            <RecipePreview
              class="recipePreview"
              :recipe="recipes[i * 5 + j]"
              :width="14.9"
              :height="30"
            />
          </b-col>
        </b-row>
      </div>
      <div v-if="recipes.length % 5 != 0">
        <b-row>
          <b-col class="col" v-for="(n, i) in recipes.length % 5" :key="i">
            <RecipePreview
              class="recipePreview"
              :recipe="recipes[5 * Math.floor(recipes.length / 5) + i]"
              :width="14.9"
              :height="30"
            />
          </b-col>
        </b-row>
      </div>
    </div>
    <b-col v-else>
      <div>
        <h1><span class="badge badge-secondary">No recipes to show</span></h1>
      </div>
    </b-col>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    recipes: Array,
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
.col {
  margin-right: -67rem !important;
}
</style>
