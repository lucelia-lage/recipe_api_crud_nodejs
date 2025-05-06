const ingredientRouter = require("express").Router(); // Importation du module express pour créer un routeur d'ingrédients
const ingredientModel = require("../models/ingredientModel"); // Importation du modèle d'ingrédient pour interagir avec la base de données
const ingredientController = require("../controllers/ingredientController"); // Importation du contrôleur d'ingrédients pour gérer la logique métier : ça veut dire que ça va gérer les requêtes envoyées par le client et la réponse à renvoyer au client

ingredientRouter.post("/ingredients", ingredientController.postIngredient); // Route pour créer un nouvel ingrédient
ingredientRouter.get("/ingredients/:id", ingredientController.getIngredientsByReciper); // Route pour récupérer les ingrédients d'une recette par son ID
ingredientRouter.put("/ingredients/:id", ingredientController.putIngredient); // Route pour mettre à jour un ingrédient par son ID
ingredientRouter.delete("/ingredients/:id", ingredientController.deleteIngredient); // Route pour supprimer un ingrédient par son ID

module.exports = ingredientRouter; // exportation du router d'ingrédients
