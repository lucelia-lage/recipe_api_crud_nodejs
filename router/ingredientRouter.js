const ingredientRouter = require("express").Router();
const ingredientModel = require("../models/ingredientModel");
const ingredientController = require("../controllers/ingredientController");

ingredientRouter.post("/ingredients", ingredientController.postIngredient);
ingredientRouter.get("/ingredients/:id", ingredientController.getIngredientsByReciper);
ingredientRouter.put("/ingredients/:id", ingredientController.putIngredient); 
ingredientRouter.delete("/ingredients/:id", ingredientController.deleteIngredient);

module.exports = ingredientRouter;
