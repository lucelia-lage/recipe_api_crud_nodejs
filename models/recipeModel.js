const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    ingredients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ingredients"
    }],
    instructions: {
        type: String,
        required: true
    },
    preparation_time: {
        type: Number,
        required: true
    },
    cook_time: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model("recipes", recipeSchema);
