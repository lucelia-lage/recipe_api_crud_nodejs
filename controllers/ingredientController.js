const ingredientModel = require("../models/ingredientModel");
const recipeModel = require("../models/recipeModel");

exports.postIngredient = async (req, res) => {
    try {
        req.body.recipe = req.params.id
        const newIngredient = new ingredientModel(req.body);
        await newIngredient.save();
        await recipeModel.updateOne({ _id: req.params.id }, { $push: { ingredients: newIngredient._id } })
        res.json({ message: "ingredient created", ingredient: newIngredient });
    } catch (error) {
        res.json(error.message);
    }
}

exports.getIngredientsByReciper = async (req, res) => {
    try {
        const ingredientReciper = await ingredientModel.findById(req.params.id).populate("recipe");
        res.json(ingredientReciper);
    } catch (error) {
        res.json({ message: error.message });
    }
}

exports.putIngredient = async (req, res) => {
    try {
        const ingredient = await ingredientModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
        res.json(ingredient)
    }
    catch (error) {
        res.json({ message: error.message });
    }
}

exports.deleteIngredient = async (req, res) => {
    try {
        const deletedIngredient = await ingredientModel.findByIdAndDelete(req.params.id);
        await ingredientModel.findByIdAndUpdate(req.params.recipeid, { $pull: { ingredients: req.params.id } });
        res.json({ message: "Ingrédient supprimé" });
    } catch (error) {
        res.json({ message: error.message });
    }
}