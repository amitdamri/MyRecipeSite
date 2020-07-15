<template>
  <b-overlay :show="showSpinner" rounded="sm" id="modal">
    <template v-slot:overlay>
      <div class="text-center">
        <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
        <p id="cancel-label">Please wait...</p>
      </div>
    </template>

    <div class="container">
      <div v-if="recipe">
        <div class="recipe-header pt-3 mb-4">
          <h1>{{ recipe.title }}</h1>
        </div>

        <div id="firstInfo" class="infoSections">
          <recipe-view-options-list
            @favorite="saveFavorite"
          ></recipe-view-options-list>
          <div id="recipeImage">
            <img :src="recipe.image" />
          </div>
          <div id="bCard">
            <b-card
              class="center"
              border-variant="success"
              header="Recipe Information"
            >
              <b-card-text>
                <ul class="list-group" type="none">
                  <li>
                    <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                    <strong> Ready in:</strong>
                    {{ recipe.readyInMinutes }} minutes
                  </li>
                  <br />
                  <li>
                    <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                    <strong> Rating:</strong> {{ recipe.aggregateLikes }} likes
                  </li>
                  <br />
                  <li>
                    <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                    <strong> Vegan:</strong> {{ recipe.vegan ? "Yes" : "No" }}
                  </li>
                  <br />
                  <li>
                    <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                    <strong> Vegetarian:</strong>
                    {{ recipe.vegetarian ? "Yes" : "No" }}
                  </li>
                  <br />

                  <li>
                    <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                    <strong> GlutenFree:</strong>
                    {{ recipe.glutenFree ? "Yes" : "No" }}
                  </li>
                  <br />

                  <li>
                    <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                    <strong> Servings:</strong>
                    {{ recipe.servings }}
                  </li>
                </ul>
              </b-card-text>
            </b-card>
          </div>
        </div>

        <div id="ingredients" class="infoSections">
          <div class="divider div-transparent"></div>
          <h3 align="center">★ ★ Ingredients ★ ★</h3>
          <div class="divider div-transparent"></div>
          <div class="wrapped">
            <ul type="none">
              <li
                v-for="(r, index) in recipe.extendedIngredients"
                :key="index + '_' + r.id"
              >
                <i class="fas fa-pepper-hot	" style="color:red"></i>

                {{ r.original }}
              </li>
            </ul>
          </div>
        </div>

        <div id="instructions" class="infoSections">
          <div class="divider div-transparent"></div>
          <h3 align="center">★ ★ Instructions ★ ★</h3>
          <div class="divider div-transparent"></div>
          <div class="recipe-body">
            <div class="wrapper">
              <div class="wrapped">
                <ul type="none">
                  <li v-for="s in recipe.instructions" :key="s.number">
                    <i class="fa fa-check-circle" style="color:green"></i>
                    <strong> Step {{ s.number }}</strong
                    ><br />
                    {{ s.step }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import RecipeViewOptionsList from "../components/RecipeViewComponents/RecipeViewOptionsList";
export default {
  components: {
    "recipe-view-options-list": RecipeViewOptionsList,
  },
  data() {
    return {
      recipe: null,
      showSpinner: false,
    };
  },
  async created() {
    this.showSpinner = true;
    try {
      let firstReq = this.axios.get(
        `https://assignment3-3-amit-dvir.herokuapp.com/recipes/showRecipe/${this.$route.params.recipeId}`
      );
      let secondReq = this.axios.get(
        `https://assignment3-3-amit-dvir.herokuapp.com/recipes/recipePreview/[${this.$route.params.recipeId}]`
      );

      this.axios
        .all([firstReq, secondReq])
        .then(
          this.axios.spread((...responses) => {
            const firstResponse = responses[0];
            const secondResponse = responses[1];

            if (firstResponse.status !== 200 || secondResponse.status !== 200) {
              this.$router.replace("/NotFound");
              return;
            }

            let {
              instructions,
              extendedIngredients,
              servings,
            } = firstResponse.data[this.$route.params.recipeId];

            let {
              aggregateLikes,
              readyInMinutes,
              image,
              title,
              vegan,
              vegetarian,
              glutenFree,
            } = secondResponse.data[this.$route.params.recipeId];

            let _recipe = {
              instructions,
              extendedIngredients,
              servings,
              aggregateLikes,
              readyInMinutes,
              image,
              title,
              vegan,
              vegetarian,
              glutenFree,
            };
            this.recipe = _recipe;
            this.showSpinner = false;
          })
        )
        .catch((error) => {
          console.log("error.response.status", error.response.status);
          this.showSpinner = false;
          this.$router.replace("/NotFound");
        });
    } catch (error) {
      console.log(error);
      this.showSpinner = false;
    }
  },
  beforeCreate() {
    document.body.className = "recipeview";
  },
  methods: {
    async saveFavorite() {
      if ($root.store.username) {
        try {
          let response = this.axios.get(
            `https://assignment3-3-amit-dvir.herokuapp.com/user/saveFavoriteRecipe`,
            {
              recipeID: this.recipe.id,
            }
          );
        } catch (error) {}
      } else {
        window.alert("Login first.");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: rgba(255, 255, 255, 0.8);
  width: 1100px;
  min-height: 700px;
}

h1 {
  color: #d58a4dd7;
  font-family: "Great Vibes", cursive;
  font-size: 50px;
  line-height: 50px;
  width: 75%;
  font-weight: normal;
  text-align: left;
  text-shadow: 0 1px 1px #fff;
}
.infoSections {
  min-width: 1110px;
}

.divider {
  clear: left;
  position: relative;
  height: 3px;
}

.div-transparent:before {
  content: "";
  position: absolute;
  top: 0;
  left: 5%;
  right: 5%;
  width: 90%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    transparent,
    rgb(48, 49, 51),
    transparent
  );
}

.wrapper {
  display: flex;
}
.wrapped {
  width: 50%;
}

#recipeImage {
  float: left;
  margin-right: 50px;
  height: 370px;
  width: 570px;
  margin-bottom: 20px;
}

#bCard {
  float: left;
  min-width: 20rem;
}
</style>
