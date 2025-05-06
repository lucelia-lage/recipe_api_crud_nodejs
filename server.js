const express = require("express"); // Importation du module express pour créer une application web : express est un framework pour Node.js qui facilite la création d'applications web et d'API
const mongoose = require("mongoose");// Importation du module mongoose pour interagir avec MongoDB : mongoose est une bibliothèque qui permet de modéliser les données et de gérer les interactions avec la base de données MongoDB
const recipeRouter = require("./router/recipeRouter"); // Importation du routeur de recettes : ça va gérer les routes liées aux recettes
const ingredientRouter = require("./router/ingredientRouter"); // Importation du routeur d'ingrédients : ça va gérer les routes liées aux ingrédients

require("dotenv").config(); // Importation du module dotenv pour gérer les variables d'environnement : ça permet de charger les variables d'environnement à partir d'un fichier .env

const app = express(); // Création de l'application express : ça initialise une nouvelle application express
app.use(express.json()); // Middleware pour parser le corps des requêtes en JSON : ça permet de traiter les données envoyées par le client au format JSON
app.use(recipeRouter); // Utilisation du routeur de recettes : ça permet de gérer les routes liées aux recettes
app.use(ingredientRouter); // Utilisation du routeur d'ingrédients : ça permet de gérer les routes liées aux ingrédients

app.listen(process.env.PORT, (err) => { // Démarrage du serveur sur le port défini dans les variables d'environnement : ça permet de lancer le serveur et d'écouter les requêtes entrantes sur le port spécifié
    if (err) {
        console.log(err);
    }else {
  console.log(`Connecté sur le port ${process.env.PORT}`);
}
});

mongoose.connect(process.env.URL_BDD); // Connexion à la base de données MongoDB : ça permet de se connecter à la base de données MongoDB en utilisant l'URL définie dans les variables d'environnement
