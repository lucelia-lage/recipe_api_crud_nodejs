const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom de l'ingrédient est requis"],
        match: [/^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,50}$/, "Nom invalide"]
    },
    quantity: {
        type: String,
        required: [true, "La quantité est requise"]
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "recipes",
        required: true
    }
});

const ingredientModel = mongoose.model("ingredients", ingredientSchema);
module.exports = ingredientModel;
