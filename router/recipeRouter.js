const recipeRouter = require("express").Router();
const recipeModel = require("../models/recipeModel");
const recipeController = require("../controllers/recipeController");

recipeRouter.post("/recipes", recipeController.postRecipe);
recipeRouter.get("/recipes", recipeController.getRecipes);
recipeRouter.get("/recipes/:id", recipeController.getRecipe);
recipeRouter.put("/recipes/:id", recipeController.updateRecipe);
recipeRouter.delete("/recipes/:id", recipeController.deleteRecipe);

module.exports = recipeRouter
