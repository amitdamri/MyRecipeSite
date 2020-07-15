<template>
  <div class="recipe-preview">
    <router-link :to="{ name: 'recipe', params: { recipeId: recipe.id } }">
      <div class="recipe-body">
        <img :src="recipe.image" class="recipe-image" height="200px" />
      </div>
    </router-link>
    <div class="recipe-info">
      <b-card class="center" border-variant="success" :header="recipe.title">
        <b-card-text>
          <b-container>
            <b-row>
              <b-col>
                <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                <strong> Ready in:</strong>
                {{ recipe.readyInMinutes }} minutes</b-col
              >
              <b-col>
                <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                <strong> Rating:</strong>
                {{ recipe.aggregateLikes }} likes</b-col
              >
            </b-row>
            <b-row>
              <b-col>
                <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                <strong> Vegan:</strong> {{ recipe.vegan ? "Yes" : "No" }}
              </b-col>

              <b-col>
                <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                <strong> Vegetarian:</strong>
                {{ recipe.vegetarian ? "Yes" : "No" }}
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                <strong> GlutenFree:</strong>
                {{ recipe.glutenFree ? "Yes" : "No" }}
              </b-col>
              <b-col>
                <i class="fas fa-eye" style="color:#d58a4dd7"></i>
                <strong> Watched:</strong>
                {{ recipe.watchedBefore ? "Yes" : "No" }}
              </b-col>
            </b-row>
          </b-container>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.recipe-preview {
  float: left;
  height: 200px;
  width: 100%;
  margin-bottom: 10px;
  margin-top: 10px;
  margin-left: 50px;
}

.recipe-body {
  float: left;
  margin-right: 30px;
}

.recipe-info {
  width: 900px;
  min-width: 800px;
}
</style>
