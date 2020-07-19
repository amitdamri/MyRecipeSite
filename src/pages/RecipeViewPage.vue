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
            :isSpecial="isSpecialRecipe"
          ></recipe-view-options-list>
          <div id="recipeImage">
            <img :src="recipe.image" width="600px" height="370px" />
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
                    <strong> Rating:</strong>
                    {{ recipe.aggregateLikes }} likes
                  </li>

                  <br />

                  <li>
                    <span>
                      <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                      <strong> Vegan:</strong> {{ recipe.vegan ? "Yes" : "No" }}
                    </span>
                    <span v-if="isFamilyRecipe" style="margin-left:45px;">
                      <i class="fas fa-user-edit"></i>
                      <strong> Author:</strong>
                      {{ recipe.author }}
                    </span>
                  </li>

                  <br />
                  <li>
                    <span>
                      <i class="fas fa-pizza-slice" style="color:#d58a4dd7"></i>
                      <strong> Vegetarian:</strong>
                      {{ recipe.vegetarian ? "Yes" : "No" }}
                    </span>
                    <span v-if="isFamilyRecipe" style="margin-left:10px;">
                      <i class="fas fa-sun" style="color:green"></i>
                      <strong> When:</strong>
                      {{ recipe.whenAcceptable }}
                    </span>
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
    if (this.$route.params.type == "api") await this.getInfoTwoRequests();
    else if (
      this.$route.params.type == "myRecipes" ||
      this.$route.params.type == "familyRecipes"
    )
      await this.getInfoOneRequest();
  },

  beforeCreate() {
    document.body.className = "recipeview";
  },

  methods: {
    async saveFavorite() {
      if (this.$root.store.username) {
        try {
          console.log(this.recipe.id);
          let response = this.axios.post(
            `http://localhost:3030/user/saveFavoriteRecipe`,
            {
              recipeID: this.recipe.id,
            }
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        window.alert("Login first.");
      }
    },
    //if user inserted recipe id manualy in site path
    async getInfoTwoRequests() {
      try {
        let firstReq = this.axios.get(
          `http://localhost:3030/recipes/showRecipe/${this.$route.params.recipeId}`
        );
        let secondReq = this.axios.get(
          `http://localhost:3030/recipes/recipePreview/[${this.$route.params.recipeId}]`
        );

        this.axios
          .all([firstReq, secondReq])
          .then(
            this.axios.spread((...responses) => {
              const firstResponse = responses[0];
              const secondResponse = responses[1];

              if (
                firstResponse.status !== 200 ||
                secondResponse.status !== 200
              ) {
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

              this.recipe = {
                id: this.$route.params.recipeId,
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
    //if user clicked on recipe image
    async getInfoOneRequest() {
      try {
        let response = {};
        if (this.$route.params.type == "myRecipes") {
          response = await this.axios.get(
            `http://localhost:3030/user/showUserRecipe/${this.$route.params.recipeId}`
          );
        } else if (this.$route.params.type == "familyRecipes") {
          response = await this.axios.get(
            `http://localhost:3030/user/showUserFamilyRecipe/${this.$route.params.recipeId}`
          );
        } else {
          this.$router.replace("/NotFound");
          return;
        }

        if (response.status !== 200) {
          this.$router.replace("/NotFound");
          return;
        }

        let {
          aggregateLikes,
          readyInMinutes,
          image,
          title,
          vegan,
          vegetarian,
          glutenFree,
          instructions,
          extendedIngredients,
          servings,
          author,
          whenAcceptable,
        } = response.data[this.$route.params.recipeId];

        this.recipe = {
          id: this.$route.params.recipeId,
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
          author,
          whenAcceptable,
        };

        this.showSpinner = false;
      } catch (error) {
        this.showSpinner = false;

        this.$router.replace("/NotFound");
        console.log(error);
      }
    },
  },

  watch: {
    $route(to, from) {
      this.$route.params.recipeId = to.params.recipeId;
    },
  },

  computed: {
    isSpecialRecipe() {
      return (
        this.$route.params.type == "myRecipes" ||
        this.$route.params.type == "familyRecipes"
      );
    },
    isFamilyRecipe() {
      return this.$route.params.type == "familyRecipes";
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: rgba(255, 255, 255, 0.8);
  min-width: 1100px;
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
