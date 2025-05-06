const recipeRouter = require("express").Router(); // Importation du module express pour créer un routeur de recettes
const recipeModel = require("../models/recipeModel"); // Importation du modèle de recette pour interagir avec la base de données
const recipeController = require("../controllers/recipeController"); // Importation du contrôleur de recettes pour gérer la logique métier : ça veut dire que ça va gérer les requêtes envoyées par le client et la réponse à renvoyer au client

recipeRouter.get("/recipes/search", recipeController.searchRecipes); // cette route doit être avant la route get("/recipes/:id") sinon elle ne sera pas prise en compte

recipeRouter.post("/recipes", recipeController.postRecipe); // Route pour créer une nouvelle recette
recipeRouter.get("/recipes", recipeController.getRecipes); // Route pour récupérer toutes les recettes
recipeRouter.get("/recipes/:id", recipeController.getRecipe); // Route pour récupérer une recette par son ID
recipeRouter.put("/recipes/:id", recipeController.updateRecipe); // Route pour mettre à jour une recette par son ID
recipeRouter.delete("/recipes/:id", recipeController.deleteRecipe); // Route pour supprimer une recette par son ID

module.exports = recipeRouter // exportation du router de recettes
