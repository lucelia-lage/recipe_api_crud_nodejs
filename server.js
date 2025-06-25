const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require('cors');

const recipeRouter = require("./router/recipeRouter");
const ingredientRouter = require("./router/ingredientRouter");

require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express();  // <-- app défini TOUT DE SUITE ici

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (CSS, JS, images, etc.)
// Assure-toi que ton dossier s'appelle bien "public" ou "assets"
app.use('/assets', express.static(path.join(__dirname, 'assets'))); 

// Route racine qui envoie index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Routes API
app.use(recipeRouter);
app.use(ingredientRouter);

// Lancement du serveur
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Connecté sur le port ${PORT}`);
  }
});

// Connexion à la base de données
mongoose.connect(process.env.URL_BDD);
