<template>
  <div class="recipe-preview">
    <router-link
      :to="{
        name: 'recipe',
        params: { type: recipeType, recipeId: recipe.id },
      }"
    >
      <div class="recipe-body">
        <img
          :src="recipe.image"
          class="recipe-image"
          height="200px"
          width="300px"
        />
      </div>
    </router-link>
    <div class="recipe-info">
      <b-card class="center" border-variant="success" :header="recipe.title">
        <b-card-text>
          <b-container>
            <b-row>
              <b-col>
                <div style="float: left; margin-right: 2px;">
                  <img
                    src="../../../resources/clock.png"
                    width="20"
                    height="20"
                  />
                </div>
                <div style="float: left;">
                  <strong>Ready in:</strong>
                  {{ recipe.readyInMinutes }} minutes
                </div>
                <div style="float: none; clear: both;"></div>
              </b-col>

              <b-col>
                <div style="float: left; margin-right: 2px;">
                  <img
                    src="../../../resources/likes.jpg"
                    width="20"
                    height="20"
                  />
                </div>
                <div style="float: left;">
                  <strong> Rating:</strong>
                  {{ recipe.aggregateLikes }} likes
                </div>
                <div style="float: none; clear: both;"></div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div style="float: left; margin-right: 2px;">
                  <img
                    src="../../../resources/vegan.png"
                    width="20"
                    height="20"
                  />
                </div>
                <div style="float: left;">
                  <strong> Vegan:</strong> {{ recipe.vegan ? "Yes" : "No" }}
                </div>
                <div style="float: none; clear: both;"></div>
              </b-col>

              <b-col>
                <div style="float: left; margin-right: 2px;">
                  <img
                    src="../../../resources/vegetarian.png"
                    width="20"
                    height="20"
                  />
                </div>
                <div style="float: left;">
                  <strong> Vegetarian:</strong>
                  {{ recipe.vegetarian ? "Yes" : "No" }}
                </div>
                <div style="float: none; clear: both;"></div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div style="float: left; margin-right: 2px;">
                  <img
                    src="../../../resources/glutenFree.png"
                    width="20"
                    height="20"
                  />
                </div>
                <div style="float: left;">
                  <strong> GlutenFree:</strong>
                  {{ recipe.glutenFree ? "Yes" : "No" }}
                </div>
                <div style="float: none; clear: both;"></div>
              </b-col>

              <b-col>
                <i class="fas fa-eye" style="color:#d58a4dd7"></i>
                <strong> Watched:</strong> Yes
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div style="float: left; margin-right: 2px;">
                  <img
                    src="../../../resources/favorite.png"
                    width="20"
                    height="20"
                  />
                </div>
                <div style="float: left;"><strong> Favorite:</strong> Yes</div>
                <div style="float: none; clear: both;"></div>
              </b-col>

              <b-col v-if="checkFamilyRecipe">
                <i class="fas fa-user-edit"></i>
                <strong> Author:</strong>
                {{ recipe.author }}
              </b-col>
            </b-row>

            <b-row v-if="checkFamilyRecipe">
              <b-col>
                <i class="fas fa-sun" style="color:yellow"></i>
                <strong> WhenAcceptable:</strong>
                {{ recipe.whenAcceptable }}
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
    recipeType: {
      type: String,
      required: true,
    },
  },
  computed: {
    checkFamilyRecipe() {
      return this.recipeType == "familyRecipes";
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
