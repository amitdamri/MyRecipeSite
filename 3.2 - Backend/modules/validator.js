const { query, param, body, validationResult } = require("express-validator");

//search recipe rules
const searchValidationRules = [
  // number must be a number and one of 5/10/15.
  param("number")
    .isInt()
    .withMessage("number must be an integer number.")
    .matches("(5|10|15)")
    .withMessage("number must be 5/10/15."),
  query("diet")
    .isIn([
      null,
      "Gluten Free",
      "Ketogenic",
      "Vegetarian",
      "Lacto-Vegetarian",
      "Ovo-Vegetarian",
      "Vegan",
      "Pescetarian",
      "Paleo",
      "Primal",
      "Whole30",
    ])
    .withMessage("Inserted invalid option for diet."),
  query("cuisine")
    .isIn([
      null,
      "African",
      "American",
      "British",
      "Cajun",
      "Caribbean",
      "Chinese",
      "Eastern European",
      "European",
      "French",
      "German",
      "Greek",
      "Indian",
      "Irish",
      "Italian",
      "Japanese",
      "Jewish",
      "Korean",
      "Latin American",
      "Mediterranean",
      "Mexican",
      "Middle Eastern",
      "Nordic",
      "Southern",
      "Spanish",
      "Thai",
      "Vietnamese",
    ])
    .withMessage("Inserted invalid option for cuisine."),
  query("intolerances")
    .isIn([
      null,
      "Dairy",
      "Egg",
      "Gluten",
      "Grain",
      "Peanut",
      "Seafood",
      "Sesame",
      "Shellfish",
      "Soy",
      "Sulfite",
      "Tree Nut",
      "Wheat",
    ])
    .withMessage("Inserted invalid option for intolerances."),
];

//get recipe method rules
const getRecipeIDValidationRules = [
  // number must be a number and one of 5/10/15.
  param("recipeID").isInt().withMessage("recipeID must be an integer number."),
];

//post recipe method rules
const postRecipeIDValidationRules = [
  // number must be a number and one of 5/10/15.
  body("recipeID").isInt().withMessage("recipeID must be an integer number."),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  // throw { status: 422, message: extractedErrors };
  throw { status: 422, message: errors };
};

//Helper function - check if given array (as string) contains only numbers separated by comma (or empty)
function checkIfArrayOfNumbers(str) {
  if (str != "") {
    if (str.charAt(0) != "[" || str.charAt(str.length - 1) != "]")
      throw { status: 404, message: "Recipe IDs should be an array" };
    str = str.substring(1, str.length - 1);
    for (var i = 0; i < str.length; i++) {
      if (isNaN(str.charAt(i)) && str.charAt(i) != ",")
        throw { status: 404, message: "Recipe IDs contains only numbers" };
    }
  }
}

module.exports = {
  checkIfArrayOfNumbers,
  searchValidationRules,
  getRecipeIDValidationRules,
  postRecipeIDValidationRules,
  validate,
};
