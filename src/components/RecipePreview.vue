<template>
  <router-link
    :to="{
      name: 'recipe',
      params: { type: 'api', recipeId: recipe.id, recipe: recipe },
    }"
  >
    <div>
      <b-card
        :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
        :title="recipe.title"
        :img-src="recipe.image"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <b-card-text>
          <ul class="recipe-overview">
            <li>
              <div style="float: left;">
                <img src="../../resources/clock.png" width="20" height="20" />
              </div>
              <div style="float: left;">
                Ready in {{ recipe.readyInMinutes }} minutes
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li>
              <div style="float: left;">
                <img src="../../resources/likes.jpg" width="20" height="20" />
              </div>
              <div style="float: left;">
                Rating: {{ recipe.aggregateLikes }} likes
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li>
              <div style="float: left;">
                <img
                  src="../../resources/vegetarian.png"
                  width="20"
                  height="20"
                />
              </div>
              <div style="float: left;">
                Vegetarian: {{ recipe.vegetarian }}
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li>
              <div style="float: left;">
                <img src="../../resources/vegan.png" width="20" height="20" />
              </div>
              <div style="float: left;">Vegan: {{ recipe.vegan }}</div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li>
              <div style="float: left;">
                <img
                  src="../../resources/glutenFree.png"
                  width="20"
                  height="20"
                />
              </div>
              <div style="float: left;">
                Gluten free: {{ recipe.glutenFree }}
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li v-if="recipeUserAdd">
              <div style="float: left;">
                <img src="../../resources/watched.png" width="20" height="20" />
              </div>
              <div style="float: left;">
                Watched: {{ recipeUserAdd.watchedBefore }}
              </div>
              <div style="float: none; clear: both;"></div>
            </li>

            <li v-if="recipeUserAdd">
              <div style="float: left;">
                <img
                  src="../../resources/favorite.png"
                  width="20"
                  height="20"
                />
              </div>
              <div style="float: left;">
                Favorite: {{ recipeUserAdd.favorite }}
              </div>
              <div style="float: none; clear: both;"></div>
            </li>
          </ul>
        </b-card-text>
      </b-card>
    </div>
  </router-link>
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
</style>
