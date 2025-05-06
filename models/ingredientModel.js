const mongoose = require("mongoose"); // Importation de mongoose pour la gestion de la base de données MongoDB 

const ingredientSchema = new mongoose.Schema({ // Création d'un schéma pour les ingrédients : ça définit la structure des documents dans la collection d'ingrédients
    name: {
        type: String,
        required: [true, "Le nom de l'ingrédient est requis"],
        match: [/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/, "Nom invalide"] // Validation du nom de l'ingrédient : il doit être composé de lettres, d'accents, d'apostrophes, d'espaces et avoir une longueur entre 2 et 50 caractères
    },
    quantity: {
        type: String,
        required: [true, "La quantité est requise"]
    },
    recipe: { // Référence à la recette à laquelle l'ingrédient appartient : ça permet de lier l'ingrédient à une recette spécifique
        type: mongoose.Schema.Types.ObjectId, // Type d'identifiant d'objet de mongoose : ça permet de créer une référence vers un autre document dans la base de données
        ref: "recipes",  // Fais référence au modèle recipes'
        required: true
    }
});

const ingredientModel = mongoose.model("ingredients", ingredientSchema) // Création du modèle d'ingrédient à partir du schéma défini précédemment
module.exports = ingredientModel; // Exportation du modèle pour l'utiliser dans d'autres fichiers de l'application
