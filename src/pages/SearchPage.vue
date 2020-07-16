<template>
  <div class="container">
    <b-overlay :show="showSpinner" rounded="sm">
      <template v-slot:overlay>
        <div class="text-center">
          <b-icon icon="stopwatch" font-scale="3" animation="cylon"></b-icon>
          <p id="cancel-label">Please wait...</p>
        </div>
      </template>

      <b-jumbotron>
        <form id="searchForm">
          <div class="p-1 bg-light rounded rounded-pill shadow-sm mb-4">
            <div class="input-group">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="What are you looking for?"
                aria-describedby="button-addon1"
                class="form-control border-0 bg-light"
                required
              />
              <div class="input-group-append">
                <button
                  id="button-addon1"
                  type="submit"
                  class="btn btn-link text-primary"
                  @click.prevent="searchRecipes"
                >
                  <i class="fa fa-search"></i>
                </button>
              </div>
            </div>
          </div>

          <div id="advancedSearch">
            <b-button
              @click="showAdvance = !showAdvance"
              pill
              class="btn btn-light"
              id="advanceButton"
              >Advanced Search &#x25BC;</b-button
            >
            <div id="center">
              <transition name="fade">
                <div class="form-row" v-if="showAdvance">
                  <div class="list">
                    <result-list
                      @selected="updateNumberOfResults"
                    ></result-list>
                  </div>

                  <div class="list">
                    <cuisine-list @selected="updateCuisine"></cuisine-list>
                  </div>

                  <div class="list">
                    <diet-list @selected="updateDiet"></diet-list>
                  </div>

                  <div class="list">
                    <intolerances-list
                      @selected="updateIntolerances"
                    ></intolerances-list>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </form>
      </b-jumbotron>

      <div v-if="this.results.length > 0">
        <results-bar
          :numberOfResults="results.length"
          @selected="sortRecipes"
        ></results-bar>
        <RecipePreviewListRow
          id="recipePrev"
          :recipes="results"
        ></RecipePreviewListRow>
      </div>

      <div class="d-flex justify-content-center m-5" v-else-if="!isFound">
        <h1>No Recipes Found.</h1>
      </div>
    </b-overlay>
  </div>
</template>

<script>
import NumberOfResultsList from "../components/SearchComponenets/NumberOfResultsList";
import CuisineList from "../components/SearchComponenets/CuisineList";
import DietList from "../components/SearchComponenets/DietList";
import IntolerancesList from "../components/SearchComponenets/IntolerancesList";
import RecipePreviewListRow from "../components/RecipePreviewListRow";
import ResultsBar from "../components/SearchComponenets/ResultsBar";

export default {
  components: {
    "result-list": NumberOfResultsList,
    "cuisine-list": CuisineList,
    "diet-list": DietList,
    "intolerances-list": IntolerancesList,
    "RecipePreviewListRow": RecipePreviewListRow,
    "results-bar": ResultsBar,
  },
  data() {
    return {
      searchQuery: "",
      numberOfResults: 5,
      cuisine: undefined,
      diet: undefined,
      intolerances: undefined,
      results: [],
      isFound: true,
      showAdvance: false,
      showSpinner: false,
    };
  },
  methods: {
    updateNumberOfResults(selectedResults) {
      this.numberOfResults = selectedResults;
    },
    updateCuisine(selectedCuisine) {
      this.cuisine = selectedCuisine;
    },
    updateDiet(selectedDiet) {
      this.diet = selectedDiet;
    },
    updateIntolerances(selectedIntolerances) {
      this.intolerances = selectedIntolerances;
    },
    sortRecipes(selectedSort) {
      if (selectedSort == "Ready In Minutes") {
        this.results.sort(function(first, second) {
          return second.readyInMinutes - first.readyInMinutes;
        });
      } else if (selectedSort == "Likes") {
        this.results.sort(function(first, second) {
          return second.aggregateLikes - first.aggregateLikes;
        });
      }
    },

    async searchRecipes() {
      //init data
      try {
        let params = {};
        this.results = [];
        this.isFound = true;
        this.showSpinner = true;

        //advanced search parameters
        if (this.cuisine != undefined && this.cuisine != "Select Cuisine...") {
          params["cuisine"] = this.cuisine;
        }
        if (this.diet != undefined && this.diet != "Select Diet...") {
          params["diet"] = this.diet;
        }
        if (
          this.intolerances != undefined &&
          this.intolerances != "Select Intolerances..."
        ) {
          params["intolerances"] = this.intolerances;
        }

        //search recipe
        let response = await this.axios.get(
          `http://localhost:3000/recipes/search/query/${this.searchQuery}/amount/${this.numberOfResults}`,
          {
            params,
          }
        );

        //set results
        this.results = Object.keys(response.data).map((recipeID) => {
          return {
            id: recipeID,
            image: response.data[recipeID].image,
            title: response.data[recipeID].title,
            readyInMinutes: response.data[recipeID].readyInMinutes,
            aggregateLikes: response.data[recipeID].aggregateLikes,
            vegetarian: response.data[recipeID].vegetarian,
            vegan: response.data[recipeID].vegan,
            glutenFree: response.data[recipeID].glutenFree,
          };
        });

        if (this.results.length <= 0) {
          this.isFound = false;
        } else {
          this.isFound = true;
          if (this.$root.store.username) {
            this.$root.store.searchLastResults = this.results;
          }
        }
      } catch (error) {
        console.log(error);
        this.$router.replace("/NotFound");
      }
      this.showSpinner = false;
    },
  },
  beforeCreate() {
    document.body.className = "search";
  },
  created() {
    if (this.$root.store.username && this.$root.store.searchLastResults) {
      this.results = this.$root.store.searchLastResults;
    }
  },
};
</script>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";

.jumbotron {
  background-image: url("../assets/ltP7UD.jpg");
  background-repeat: no-repeat;
  background-size: 110%;
  height: 225px;
  margin-bottom: 0px;
}

#advanceButton {
  font-size: 15px;
  font-weight: bold;
  color: rgb(0, 0, 0);
}

.container {
  padding: 0px;
  min-width: 1300px;
  background-color: rgba(255, 255, 255, 0.8);
}

#advancedSearch {
  text-align: center;
}

#center {
  margin-left: 15%;
}

.form-control {
  margin: 7px;
  font-size: 0.95rem;
  color: rgb(5, 5, 5);
  font-style: normal;
}

.form-control:focus {
  box-shadow: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to /*.fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.list {
  margin-top: 3px;
  margin-right: 15px;
}
</style>
