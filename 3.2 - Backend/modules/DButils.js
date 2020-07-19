require("dotenv").config();
const sql = require("mssql");

const config = {
  user: process.env.tedious_userName,
  password: process.env.tedious_password,
  server: process.env.tedious_server,
  database: process.env.tedious_database,
  connectionTimeout: 1500000,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool
  .connect()
  .then(() => console.log("new connection pool Created"))
  .catch((err) => console.log(err));


async function execQuery(query) {
  await poolConnect;
  try {
    var result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL error", err);
    throw err;
  }
};

// Helper function - return user by username
exports.getUserFromUsers = async function getUsernameFromUsers(username) {
  try {
    return execQuery(
      `SELECT * FROM dbo.users 
      WHERE username = '${username}'`);
  }
  catch (error) {
    throw (error);
  }
};

// Helper function: Add new user to db in registeration
exports.addNewUser = async function addNewUser(user) {
  try {

    const { username, firstName, lastName, country, hash_password, email, image } = user;

    await execQuery(
      `INSERT INTO dbo.users VALUES (default, '${username}', 
      '${firstName}', '${lastName}', '${country}', 
      '${hash_password}', '${email}', '${image}')`);

  } catch (error) {
    throw error;
  }
};

// Helper function - return last 3 (or less) recipes have been watched by the user
exports.getLast3RecipesWatched = async function getLast3RecipesWatched(username) {
  try {
      return await execQuery(
      `SELECT TOP 3 recipe_id
      FROM dbo.users_recipes_watched 
      WHERE username = '${username}'
      ORDER BY dateAdded DESC`
      );
  } catch (error) {
    throw error;
  }
};

// Helper function - return username by user_id (hashed cookie)
exports.getUsernameByUserID = async function getUsernameByUserID(user_id) {
  try {
    return await execQuery(
      `SELECT username FROM dbo.users WHERE user_id = '${user_id}'`
    );
  } catch (error) {
    throw (error);
  }
};

// Helper function - get regisetred user by it's user_id (hashed cookie) 
exports.getRegisteredUser = async function getRegisteredUser(user_id) {

  try {
    let user = await execQuery(
      `SELECT * FROM dbo.users WHERE user_id = '${user_id}'`);
    return user;

  } catch (error) {
    throw (error);
  }

};

// Helper function - return the given recipe has been watched by given user (or empty if hasn't)
exports.getRecipesWatchedByUser = async function getRecipesWatchedByUser(username) {
  try {
    return await execQuery(
      `SELECT recipe_id FROM dbo.users_recipes_watched WHERE username = '${username}'`
    );
  } catch (error) {
    throw error;
  }

};

// Helper function - return the given recipe has been saved as favorite by given user (or empty if hasn't)
exports.getFavoriteRecipesByUser = async function getFavoriteRecipesByUser(username) {
  try {
    return execQuery(
      `SELECT recipe_id FROM dbo.users_recipes_favorites WHERE username='${username}'`
    );
  } catch (error) {
    throw error;
  }
};

//save recipe to user favorites
exports.saveToFavorites = async function saveToFavorites(username, recipeID) {
  try {
    await execQuery(
      `INSERT INTO dbo.users_recipes_favorites
      VALUES('${username}', '${recipeID}')`
    );
  } catch (error) {
    throw error;
  }

}

//returns user recipes according to his username
exports.getUserRecipes = async function getUserRecipes(username) {
  try {
    return await execQuery(
      `SELECT * FROM dbo.userRecipes
       WHERE username='${username}'`);
  } catch (error) {
    throw error;
  }
}

//returns only one recipe according to the username and recipeID
exports.getUserRecipe = async function getUserRecipe(username, recipeID) {
  try {
    return await execQuery(
      `SELECT * FROM dbo.userRecipes
       WHERE username='${username}' AND id='${recipeID}'`);
  } catch (error) {
    throw error;
  }
}

//returns userRecipe (MyRecipe) ingredients
exports.getUserRecipeIngredients = async function getUserRecipeIngredients(recipeID) {
  try {
    return await execQuery(
      `SELECT name, amount, unit FROM dbo.userRecipes_ingredients
       WHERE id='${recipeID}'`);
  } catch (error) {
    throw error;
  }
}

//insets recipe that watched by the user
exports.insertRecipeWatchedByUser = async function insertRecipeWatchedByUser(username, recipeID){
  try {
    return await execQuery(
      `INSERT INTO dbo.users_recipes_watched 
      (username, recipe_id)
       VALUES ('${username}', '${recipeID}')`);
  } catch (error) {
    throw error;
  }
  
}
//update the time the recipe was watched by the user
exports.updateRecipeWatchedByUser = async function updateRecipeWatchedByUser(username, recipeID){
  try {
    return await execQuery(
      `UPDATE dbo.users_recipes_watched
       SET dateAdded=GETDATE()
       where username='${username}' AND recipe_id = '${recipeID}'`);
  } catch (error) {
    throw error;
  }
  
}

//returns ingredients of a family recipe
exports.getUserFamilyRecipeIngredients = async function getUserFamilyRecipeIngredients(recipeID) {
  try {
    return await execQuery(
      `SELECT name, amount, unit FROM dbo.userFamilyRecipes_ingredients
       WHERE id='${recipeID}'`);
  } catch (error) {
    throw error;
  }
}

//returns all the family recipes of a user
exports.getUserFamilyRecipes = async function getUserFamilyRecipes(username){
  try {
    return await execQuery(
      `SELECT * FROM dbo.userFamilyRecipes
      WHERE username='${username}'`);
  } catch (error) {
    throw error;
  }
}

//returns only one family recipe
exports.getUserFamilyRecipe = async function getUserFamilyRecipe(username, recipeID) {
  try {
    return await execQuery(
      `SELECT * FROM dbo.userFamilyRecipes
       WHERE username='${username}' AND id='${recipeID}'`);
  } catch (error) {
    throw error;
  }
}

//inserts new userRecipe
exports.insertUserRecipeInfo = async function insertUserRecipeInfo(userRecipe){
  try {
    return await execQuery(
      `INSERT INTO dbo.userRecipes VALUES(
        '${userRecipe.id}',
        '${userRecipe.username}',
        '${userRecipe.title}',
        '${userRecipe.image}',
        '${userRecipe.readyInMinutes}',
        '0', 
        '${userRecipe.vegetarian}',
        '${userRecipe.vegan}',
        '${userRecipe.glutenFree}',
        '${userRecipe.instructions}',
        '${userRecipe.servings}')`
        );
  } catch (error) {
    throw error;
  }
}

//inserts ingredients of user recipe
exports.insertUserRecipeIngredients = async function insertUserRecipeIngredients(recipeID, ingredient){
  try {
    return await execQuery(
      `INSERT INTO dbo.userRecipes_ingredients VALUES(
        '${recipeID}',
        '${ingredient.name}',
        '${ingredient.amount}',
        '${ingredient.unit}')`
        );
  } catch (error) {
    throw error;
  }
}

//returns the last id of the userRecipes (MyRecipes)
exports.getLastUserRecipeID = async function getLastUserRecipeID(){
  try {
    return await execQuery(
      `SELECT TOP 1 id
      FROM dbo.userRecipes
      ORDER BY id DESC`
    );
  } catch (error) {
    throw error;
  }
}