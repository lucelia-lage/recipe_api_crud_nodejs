const recipeModel = require("../models/recipeModel");

exports.postRecipe = async (req, res) => {
    try {
        const recipe = new recipeModel({
            title: req.body.title,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            preparation_time: req.body.preparation_time,
            cook_time: req.body.cook_time,
            difficulty: req.body.difficulty,
            category: req.body.category,
            image: req.file ? req.file.path : ""
        })
        await recipe.save();
        res.json({ message: "recipe created", recipe: recipe });
    } catch (error) {
        res.json({ message: error});
    }
}

exports.getRecipes = async (req, res) => {
    try {
        const recipes = await recipeModel.find()
        res.json(recipes)
    } catch (error) {
        res.json({ error: error.message })
    }
}

exports.getRecipe = async (req, res) => {
    try {
        const recipe = await recipeModel.findById(req.params.id)
        res.json(recipe);
    } catch (error) {
        res.json({ error: error.message });
    }
}

exports.updateRecipe = async (req, res) => {
    try {
        const updatedRecipe = await recipeModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
        res.json(updatedRecipe);
    } catch (error) {
        res.json({ error: error.message });
    }
}

exports.deleteRecipe = async (req, res) => {
    try {
        await recipeModel.findByIdAndDelete(req.params.id)
        res.json({ message: "Recette supprimée" });
    } catch (error) {
        res.json({ message: error.message });
    }
}
