var express = require("express");
var router = express.Router();
const axios = require("axios");
const validator = require("../modules/validator");
const api_domain = "https://api.spoonacular.com/recipes";
const {
  getRecipeIDValidationRules,
  searchValidationRules,
  validate,
} = require("../modules/validator");

router.get("/", (req, res) => {
  res.send("welcome to recipes");
});

// Return recipe preview: recipes main details
router.get("/recipePreview/:recipeIDs", async (req, res, next) => {
  try {
    validator.checkIfArrayOfNumbers(req.params.recipeIDs);

    let recipeIDs = JSON.parse(req.params.recipeIDs);
    let recipesDict = {};
    let promises = [];

    recipeIDs.map((recipeID) =>
      promises.push(getRecipePreviewByID(recipesDict, recipeID))
    );
    await Promise.all(promises).catch((error) => {
      throw error;
    });
    res.status(200).send(recipesDict);
  } catch (error) {
    next(error);
  }
});

// Return 3 random recipes (only those with ingredients) using spoonacular API
router.get("/3RandomRecipes", async (req, res, next) => {
  try {
    let random_recipes = await get3RandomRecipes();
    while (hasNoInstructions(random_recipes.data.recipes)) {
      random_recipes = await get3RandomRecipes();
    }

    let recipesDict = {};
    let promises = [];

    random_recipes.data.recipes.map((recipe_raw) =>
      promises.push(getRecipePreviewByID(recipesDict, recipe_raw.id))
    );
    await Promise.all(promises).catch((error) => {
      throw error;
    });

    res.status(200).send(recipesDict);
  } catch (error) {
    next(error);
  }
});

// Helper function - return recipe preview by its ID
async function getRecipePreviewByID(recipesDict, recipeID) {
  try {
    let recipe_info = await getRecipeInfo(recipeID);
    recipesDict[recipeID] = getRecipePreviewByInfo(recipe_info.data);
  } catch (error) {
    throw error;
  }
}

// Helper function - return recipe preview out of full recipe info
function getRecipePreviewByInfo(info) {
  const {
    image,
    title,
    readyInMinutes,
    aggregateLikes,
    vegetarian,
    vegan,
    glutenFree,
  } = info;

  return {
    image: image,
    title: title,
    readyInMinutes: readyInMinutes,
    aggregateLikes: aggregateLikes,
    vegetarian: vegetarian,
    vegan: vegan,
    glutenFree: glutenFree,
  };
}

// Helper function - return recipe full info by its id
async function getRecipeInfo(id) {
  try {
    return await axios.get(`${api_domain}/${id}/information`, {
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey,
      },
    });
  } catch (error) {
    if (error.response.status == 404)
      error.response.message = "Recipe not found.";
    throw error.response;
  }
}

//Search Recipes - search for recipes according to the given searchquery and returns {number} results
//can add more filters in the request qurey
router.get(
  "/search/query/:searchQuery/amount/:number",
  searchValidationRules,
  validate,
  (req, res, next) => {
    const { searchQuery, number } = req.params;
    //set search params
    search_params = {};
    search_params.query = searchQuery;
    search_params.number = number;
    search_params.instructionsRequired = true;
    //check if query params exists
    extractQueriesParams(req.query, search_params);

    searchForRecipes(search_params)
      .then((info_array) => res.send(info_array))
      .catch((error) => {
        console.log(error);
        next(error);
      });
  }
);

//extract the parameters from the query
function extractQueriesParams(query_params, search_params) {
  const param_list = ["diet", "cuisine", "intolerances"];
  param_list.forEach((param) => {
    if (query_params[param]) {
      search_params[param] = query_params[param];
    }
  });
}

//search for recipes according to the parameters
async function searchForRecipes(search_params) {
  try {
    let search_response = await axios.get(`${api_domain}/search`, {
      params: {
        apiKey: process.env.spooncular_apiKey,
        number: search_params.number,
        query: search_params.query,
        instructionsRequired: search_params.instructionsRequired,
        cuisine: search_params.cuisine,
        diet: search_params.diet,
        intolerances: search_params.intolerances,
      },
    });

    const recipes_id_list = exratractSearchResultsIds(search_response);
    let info_array = await getRecipesInfo(recipes_id_list);
    let relevantRecipesData = extractRelevantRecipeData(info_array);
    return relevantRecipesData;
  } catch (error) {
    throw error;
  }
}

//extract ids from the results in order to get more information abou them.
function exratractSearchResultsIds(search_response) {
  let recipes = search_response.data.results;
  recipes_id_list = [];
  recipes.map((recipe) => {
    recipes_id_list.push(recipe.id);
  });
  return recipes_id_list;
}

//returns dictinary of recipes and their preview information
async function getRecipesInfo(recipes_id_list) {
  try {
    let promises = [];

    recipes_id_list.map((id) => promises.push(getRecipeInfo(id)));

    let info_response = await Promise.all(promises).catch((error) => {
      throw error.response;
    });

    return info_response;
  } catch (error) {
    throw error;
  }
}

// extracts only the required values from the data
function extractRelevantRecipeData(recipes_Info) {
  let dict = {};

  recipes_Info.map((recipe_info) => {
    const {
      id,
      image,
      title,
      readyInMinutes,
      aggregateLikes,
      vegetarian,
      vegan,
      glutenFree,
    } = recipe_info.data;

    dict[id] = {
      image: image,
      title: title,
      readyInMinutes: readyInMinutes,
      aggregateLikes: aggregateLikes,
      vegetarian: vegetarian,
      vegan: vegan,
      glutenFree: glutenFree,
    };
  });

  return dict;
}

//Show recipe - gets the required information from the api in oreder to show ther recipe.
//get instructions, ingredients and servings.
router.get(
  "/showRecipe/:recipeID",
  getRecipeIDValidationRules,
  validate,
  async (req, res, next) => {
    try {
      let recipeID = req.params.recipeID;
      let recipeInfo = await getRecipeInfo(recipeID);
      let analyzedInstructions = await getAnalayzedInstructions(recipeID);
      let requiredInfoToSend = setShowRecipeInfo(
        recipeInfo.data,
        analyzedInstructions
      );
      res.status(200).send(requiredInfoToSend);
    } catch (error) {
      next(error);
    }
  }
);

//gets analyzed instructions from the spooncular api
async function getAnalayzedInstructions(recipeID) {
  try {
    let recipeInstructions = await axios.get(
      `${api_domain}/${recipeID}/analyzedInstructions`,
      {
        params: {
          apiKey: process.env.spooncular_apiKey,
        },
      }
    );
    return recipeInstructions.data[0].steps.map((i) => {
      return {
        number: i.number,
        step: i.step,
      };
    });
  } catch (error) {
    if (error.response.status == 404)
      error.response.message = "Recipe not found.";
    throw error.response;
  }
}

//sets the required values
function setShowRecipeInfo(recipeInfo, analyzedInstructions) {
  //destructuring required info
  const { extendedIngredients, instructions, servings } = recipeInfo;

  relevantIngredientsData = extractRelevantIngredientData(extendedIngredients);

  let recipeDict = {};
  recipeDict[recipeInfo.id] = {
    extendedIngredients: relevantIngredientsData,
    instructions: analyzedInstructions,
    servings: servings,
  };

  return recipeDict;
}

//extract the relevant data for the ingredients
function extractRelevantIngredientData(ingredientInfo) {
  return ingredientInfo.map((ingredientInfo) => {
    const { name, amount, unit, original } = ingredientInfo;

    return {
      name: name,
      amount: amount,
      unit: unit,
      original: original,
    };
  });
}

// Helper function - get 3 random recipes using spoonacular API
function get3RandomRecipes() {
  try {
    // get 3 random recipes
    return axios.get(`${api_domain}/random?number=3`, {
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey,
      },
    });
  } catch (error) {
    throw error;
  }
}

// Helper function - return true if given recipe has empty instructions field
function hasNoInstructions(recipes) {
  let ans = false;
  recipes.map((recipe) =>
    recipe.instructions == "" ? (ans = true) : (ans = false)
  );
  return ans;
}

module.exports = router;
