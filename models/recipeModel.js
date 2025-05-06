const mongoose = require("mongoose"); // Importation de mongoose pour la gestion de la base de données MongoDB 

const recipeSchema = new mongoose.Schema({ // Création d'un schéma pour les recettes : ça définit la structure des documents dans la collection de recettes
    title: {
        type: String,
        required: [true, "Le titre est requis"]
    },
    ingredients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ingredients"
        }
    ],
    instructions: {
        type: String,
        required: [true, "Les instructions sont requises"]
    },
    preparation_time: {
        type: Number,
        required: [true, "Le temps de préparation est requis"]
    },
    cook_time: {
        type: Number,
        required: [true, "Le temps de cuisson est requis"]
    },
    difficulty: {
        type: String,
        enum: ["facile", "moyen", "difficile"],
        required: true
    },
    category: {
        type: String,
        required: [true, "La catégorie est requise"]
    },
    image: {
        type: String,
        default: ""
    }
});

const recipeModel = mongoose.model("recipes", recipeSchema) // Création du modèle de recette à partir du schéma défini précédemment
module.exports = recipeModel // Exportation du modèle pour l'utiliser dans d'autres fichiers de l'application
