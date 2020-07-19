var express = require("express");
var router = express.Router();
const DButils = require("../modules/DButils");
const axios = require("axios");
const validator = require("../modules/validator");
const {
  postRecipeIDValidationRules,
  getRecipeIDValidationRules,
  validate,
} = require("../modules/validator");

const api_domain = "https://api.spoonacular.com/recipes";

// Check user authorization middleware (if has cookie and whether it's valid)
router.use(function (req, res, next) {
  if (req.session && req.session.user_id) {
    getUsernameByUserID(req.session.user_id)
      .then((user) => {
        if (user) {
          req.username = user;
          next();
        } else {
          res.sendStatus(401);
        }
      })
      .catch((error) => next(error));
  } else {
    res.sendStatus(401);
  }
});

// Return recipe preview for users: main recipe details, indication whether the user has been watched
// this recipes before and whether the user has been saved it as favorite recipe
router.get("/recipePreview/:recipeIDs", async (req, res, next) => {
  try {
    validator.checkIfArrayOfNumbers(req.params.recipeIDs);

    let recipeIDs = JSON.parse(req.params.recipeIDs);
    let recipesDict = {};
    let promises = [];
    recipeIDs.map((recipeID) =>
      promises.push(
        getRecipePreview(recipesDict, { recipe_id: recipeID }, req.username)
      )
    );
    await Promise.all(promises).catch((error) => {
      throw error;
    });
    res.status(200).send(recipesDict);
  } catch (error) {
    next(error);
  }
});

// Return last 3 (or less) recipes have been watched by the user
router.get("/last3RecipesWatched", async (req, res, next) => {
  try {
    let username = req.username;
    let user_recipes = await DButils.getLast3RecipesWatched(username);
    console.log(user_recipes);

    let recipesDict = {};
    let promises = [];
    user_recipes.map((recipe) => {
      promises.push(getRecipePreview(recipesDict, recipe, username));
    });
    await Promise.all(promises).catch((error) => {
      throw error;
    });

    res.status(200).send(recipesDict);
  } catch (error) {
    next(error);
  }
});

// Add recipe out of spoonacular API to favorite list of a user
router.post("/saveFavoriteRecipe", async (req, res, next) => {
  try {
    let recipe_id = req.body.recipeID;
    let username = req.username;
    await isRecipeExists(recipe_id);

    if (await wasRecipeSavedInFavorites(recipe_id, username)) {
      throw { status: 404, message: "Recipe has already saved in favorites" };
    }
    await DButils.saveToFavorites(username, recipe_id);
    res
      .status(200)
      .send({ message: "A new recipe has been saved to favorites" });
  } catch (error) {
    next(error);
  }
});

// Helper function - return recipe full info by its id
async function isRecipeExists(id) {
  try {
    return await axios.get(`${api_domain}/${id}/information`, {
      params: {
        includeNutrition: false,
        apiKey: process.env.spooncular_apiKey,
      },
    });
  } catch (error) {
    throw {
      status: error.response.status,
      message: error.response.statusText,
      success: false,
    };
  }
}

// Helper function - return username by user_id (hashed cookie)
async function getUsernameByUserID(user_id) {
  try {
    let res = await DButils.getUsernameByUserID(user_id);
    if (res.length > 0) {
      return res[0].username;
    }
    return null;
  } catch (error) {
    throw error;
  }
}

// Helper function - return recipe user info by its id
async function getRecipePreview(dict, recipe_info, username) {
  try {
    let recipeID = recipe_info.recipe_id;
    await isRecipeExists(recipeID);
    let watchedBefore = await wasRecipeWatched(username, recipeID);
    let savedInFavorites = await wasRecipeSavedInFavorites(recipeID, username);

    dict[recipeID] = {
      watchedBefore: watchedBefore,
      savedInFavorites: savedInFavorites,
    };
  } catch (error) {
    throw error;
  }
}

//Preview of recipes from the local database
async function getUserRecipePreview(dict, recipe_info) {
  try {
    const {
      id,
      image,
      title,
      readyInMinutes,
      aggregateLikes,
      vegetarian,
      vegan,
      glutenFree,
    } = recipe_info;

    dict[id] = {
      image: image,
      title: title,
      readyInMinutes: readyInMinutes,
      aggregateLikes: aggregateLikes,
      vegetarian: vegetarian,
      vegan: vegan,
      glutenFree: glutenFree,
      watchedBefore: true,
      savedInFavorites: true,
    };
  } catch (error) {
    throw error;
  }
}

//Preview of recipes from the local database
async function getFamilyRecipePreview(dict, recipe_info) {
  try {
    const {
      id,
      title,
      image,
      readyInMinutes,
      aggregateLikes,
      vegetarian,
      vegan,
      glutenFree,
      author,
      whenAcceptable,
    } = recipe_info;

    dict[id] = {
      image: image,
      title: title,
      readyInMinutes: readyInMinutes,
      aggregateLikes: aggregateLikes,
      vegetarian: vegetarian,
      vegan: vegan,
      glutenFree: glutenFree,
      watchedBefore: true,
      savedInFavorites: true,
      author: author,
      whenAcceptable: whenAcceptable,
    };
  } catch (error) {
    throw error;
  }
}

// Helper function - return true if given recipe has been watched by given user
async function wasRecipeWatched(username, recipeID) {
  try {
    let recipes = await DButils.getRecipesWatchedByUser(username);

    if (recipes.find((recipe) => recipe.recipe_id == recipeID)) return true;

    return false;
  } catch (error) {
    throw error;
  }
}

// Helper function - return true if given recipe has been saved as favorites by given user
async function wasRecipeSavedInFavorites(recipeID, username) {
  try {
    let recipes = await DButils.getFavoriteRecipesByUser(username);

    if (recipes.find((recipe) => recipe.recipe_id == recipeID)) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
}

//My favorites - returns little preview about the user favorites. returns only the recipes id and if the user watched or/and saved
//the recipe as his favorite. the rest of the information can be get from the recipe/preview route. (favorites recipes can only be from the api)
router.get("/MyFavorites", async (req, res, next) => {
  try {
    let username = req.username;
    let favoriteRecipes = await DButils.getFavoriteRecipesByUser(username);
    let relevantData = await setRelevantUserRecipeData(
      favoriteRecipes,
      getRecipePreview,
      username
    );
    res.status(200).send(relevantData);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//My recipes - returns full preview about recipes that this user created.
//these recipes are saved in the local database and not from the api.
router.get("/MyRecipes", async (req, res, next) => {
  try {
    let username = req.username;
    let userRecipes = await DButils.getUserRecipes(username);
    let relevantData = await setRelevantUserRecipeData(
      userRecipes,
      getUserRecipePreview
    );
    res.status(200).send(relevantData);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//ShowUserRecipe - returns info about a recipe that the user created and inserted to the local database (not from the api).
//return ingredients (name,unit,amount), servings and instructions.
router.get(
  "/showUserRecipe/:recipeID",
  getRecipeIDValidationRules,
  validate,
  async (req, res, next) => {
    try {
      let username = req.username;
      let recipeInfo = await getUserRecipeInfo(
        username,
        req.params.recipeID,
        DButils.getUserRecipe
      );
      let requiredInfoToSend = await setShowUserRecipeInfo(
        recipeInfo,
        DButils.getUserRecipeIngredients
      );
      res.status(200).send(requiredInfoToSend);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

//MyFamilyRecipes- returns full preview about family recipes that correlated to this user.
//these recipes are saved in the local database and not from the api.
router.get("/MyFamilyRecipes", async (req, res, next) => {
  try {
    let userFamilyRecipes = await DButils.getUserFamilyRecipes(req.username);
    let recipesDict = await setRelevantUserRecipeData(
      userFamilyRecipes,
      getFamilyRecipePreview
    );
    res.status(200).send(recipesDict);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//ShowUserFamilyRecipe - returns info about a family recipe that the user have(not from the api).
//return ingredients (name,unit,amount), servings and instructions.
router.get(
  "/showUserFamilyRecipe/:recipeID",
  getRecipeIDValidationRules,
  validate,
  async (req, res, next) => {
    try {
      let username = req.username;
      let recipeInfo = await getUserRecipeInfo(
        username,
        req.params.recipeID,
        DButils.getUserFamilyRecipe
      );
      let requiredInfoToSend = await setShowUserRecipeInfo(
        recipeInfo,
        DButils.getUserFamilyRecipeIngredients
      );
      res.status(200).send(requiredInfoToSend);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

/*set local database recipes info - returns dictionary of recipe ids and their preview.
 * recipes_info - list of recipesIDs
 * getPreviewFunction - function that returns the required preview according to the request (my recipe or family recipe) */
async function setRelevantUserRecipeData(
  recipes_Info,
  getPreviewFunction,
  username
) {
  const promises = [];
  let recipesDict = {};
  recipes_Info.map((recipe_info) => {
    promises.push(getPreviewFunction(recipesDict, recipe_info, username));
  });

  await Promise.all(promises).catch((error) => {
    throw error;
  });

  return recipesDict;
}

/*
 *  returns recipe preview info from the local database (only for myrecipe and family recipe)
 *  recipeID - the id of the required recipe
 *  getRecipeInfoFromDBFunction - the function that returns the right inforamtion from the database.
 */
async function getUserRecipeInfo(
  username,
  recipeID,
  getRecipeInfoFromDBFunction
) {
  try {
    let recipeInfo = await getRecipeInfoFromDBFunction(username, recipeID);
    if (recipeInfo.length > 0) return recipeInfo[0];
    else throw { status: 404, message: "Recipe not found.", success: false };
  } catch (error) {
    throw error;
  }
}

/**
 * returns the required values in order the show the recipe - includes instructions, servings and ingredients(name,amount,unit).
 * @param {*} recipeInfo - contains the recipe id in order to select to information
 * @param {*} getIngredientsFromDBFunction - function that get values from the right table
 */
async function setShowUserRecipeInfo(recipeInfo, getIngredientsFromDBFunction) {
  try {
    let recipesDict = {};
    let ingredients = await getIngredientsFromDBFunction(recipeInfo.id);
    let readyIngredients = ingredients.map((ingredient) => {
      return {
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        original:
          ingredient.amount + " " + ingredient.unit + " " + ingredient.name,
      };
    });
    //destructuring required info
    const {
      id,
      title,
      image,
      readyInMinutes,
      aggregateLikes,
      vegetarian,
      vegan,
      glutenFree,
      author,
      whenAcceptable,
      instructions,
      servings,
    } = recipeInfo;

    let readyinstructions = instructions.split("\n").map((instruction) => {
      let splitted = instruction.split(";");
      return {
        number: splitted[0],
        step: splitted[1].replace("\r", ""),
      };
    });

    recipesDict[id] = {
      title: title,
      image: image,
      readyInMinutes: readyInMinutes,
      aggregateLikes: aggregateLikes,
      vegetarian: vegetarian,
      vegan: vegan,
      glutenFree: glutenFree,
      author: author,
      whenAcceptable: whenAcceptable,
      extendedIngredients: readyIngredients,
      instructions: readyinstructions,
      servings: servings,
    };

    return recipesDict;
  } catch (error) {
    throw error;
  }
}

//user has watched recipe from the api - inserts to the database indication for it.
//gets in the body the recipeID
router.post(
  "/setUserWatchedRecipe",
  postRecipeIDValidationRules,
  validate,
  async (req, res, next) => {
    try {
      let recipeID = req.body.recipeID;
      let username = req.username;
      await isRecipeExists(recipeID);
      setRecipeWatched(username, recipeID);
      res
        .status(200)
        .send({ message: "User watched the recipe successfully." });
    } catch (error) {
      next(error);
    }
  }
);

//if the user didn't watch before - insert indication
//if he did - updates the time
async function setRecipeWatched(username, recipeID) {
  try {
    //check if user already watched this recipe
    let watchedBefore = await DButils.getRecipesWatchedByUser(username);

    if (watchedBefore.find((recipe) => recipe.recipe_id == recipeID)) {
      await DButils.updateRecipeWatchedByUser(username, recipeID);
    } else {
      await DButils.insertRecipeWatchedByUser(username, recipeID);
    }
  } catch (error) {
    throw error;
  }
}

//ADD NEW USER RECIPE - get values in the body request according to the api
router.post("/addUserRecipe", async (req, res, next) => {
  try {
    let lastRecipeID = await DButils.getLastUserRecipeID();

    if (lastRecipeID.length != 0) {
      req.body.id = lastRecipeID[0].id + 1;
    } else {
      req.body.id = 1000;
    }

    req.body.username = req.username;
    let recipeInfo = getRecipeDetails(req.body);
    await DButils.insertUserRecipeInfo(recipeInfo);
    await addRecipeIngredients(recipeInfo);
    res.status(201).send({ message: "UserRecipe added successfully" });
  } catch (error) {
    next(error);
  }
});

//return recipe inforamtion
function getRecipeDetails(recipeUser) {
  try {
    const {
      id,
      username,
      image,
      title,
      readyInMinutes,
      aggregateLikes,
      vegetarian,
      vegan,
      glutenFree,
      instructions,
      servings,
      extendedIngredients,
    } = recipeUser;

    return {
      id: id,
      username: username,
      image: image,
      title: title,
      readyInMinutes: readyInMinutes,
      aggregateLikes: aggregateLikes,
      vegetarian: vegetarian,
      vegan: vegan,
      glutenFree: glutenFree,
      instructions: instructions,
      servings: servings,
      extendedIngredients: extendedIngredients,
    };
  } catch (error) {
    throw error;
  }
}

//inserts into the database the new recipe ingredients
async function addRecipeIngredients(recipeUser) {
  const promises = [];

  recipeUser.extendedIngredients.map((ingredient) => {
    promises.push(
      DButils.insertUserRecipeIngredients(recipeUser.id, ingredient)
    );
  });

  return await Promise.all(promises).catch((error) => {
    throw error.response;
  });
}

module.exports = router;
