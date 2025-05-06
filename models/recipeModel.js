const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
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

const recipeModel = mongoose.model("recipes", recipeSchema)
module.exports = recipeModel
