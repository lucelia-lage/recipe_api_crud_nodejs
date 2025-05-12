const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: String,
    required: true,
    trim: true
  }
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [ingredientSchema], // tableau d'objets { name, quantity }
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

module.exports = mongoose.model("Recipe", recipeSchema);
