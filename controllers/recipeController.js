const recipeModel = require("../models/recipeModel"); // cette ligne verifie que le modèle de recette est bien importé
const ingredientModel = require("../models/ingredientModel"); // cette ligne verifie que le modèle d'ingrédient est bien importé

exports.postRecipe = async (req, res) => { // ça c'est la fonction qui va permettre de créer une recette
    try {
        const recipe = new recipeModel({ // cette ligne crée une nouvelle recette avec le corps de la requête
            title: req.body.title, // req.body fait référence au corps de la requête envoyée par le client
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            preparation_time: req.body.preparation_time,
            cook_time: req.body.cook_time,
            difficulty: req.body.difficulty,
            category: req.body.category,
            image: req.file ? req.file.path : "" // si une image est envoyée, on l'ajoute à la recette, sinon on met une chaîne vide
        })
        await recipe.save(); // on sauvegarde la recette dans la base de données
        res.json({ message: "recipe created", recipe: recipe }); // on renvoie un message de succès et la recette créée
    } catch (error) {
        res.json({ message: error});
    }
}

exports.getRecipes = async (req, res) => { // recup toutes les recettes
    try {
        const recipes = await recipeModel.find() // on cherche toutes les recettes dans la bd 
        res.json(recipes) // on renvoie les recettes trouvées
    } catch (error) {
        res.json({ error: error.message })
    }
}

exports.getRecipe = async (req, res) => { // recup une recette par son id
    try {
        const recipe = await recipeModel.findById(req.params.id) // on cherche la recette par son id
        res.json(recipe); // on renvoie la recette trouvée
    } catch (error) {
        res.json({ error: error.message });
    }
}

exports.updateRecipe = async (req, res) => { // mettre à jour une recette
    try {
        const updatedRecipe = await recipeModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true }); // on cherche la recette par son id et on la met à jour avec le corps de la requête / runValidators: true permet de valider les données avant de les mettre à jour, new: true permet de renvoyer la recette mise à jour
        res.json(updatedRecipe); // on renvoie la recette mise à jour
    } catch (error) {
        res.json({ error: error.message });
    }
}

exports.deleteRecipe = async (req, res) => { // supprimer une recette
    try {
        await recipeModel.findByIdAndDelete(req.params.id) // on cherche la recette par son id et on la supprime
        res.json({ message: "Recette supprimée" });
    } catch (error) {
        res.json({ message: error.message });
    }
}

// A VOIR AVEC ATTENTION !! tout ce code a été très difficile à cause de l'objet ingredient qui est un tableau d'objets et pas un seul objet comme pour les recettes
exports.searchRecipes = async (req, res) => {
    try {
        const { title, category, ingredient } = req.query;
        // On crée un objet de filtre vide qui sera peuplé selon les paramètres de la requête
        let filter = {};
        // Si un titre est fourni, on l'ajoute au filtre
        if (title) {
            filter.title = { $regex: title, $options: 'i' }; // recherche insensible à la casse
        }
        // Si une catégorie est fournie, on l'ajoute au filtre
        if (category) {
            filter.category = { $regex: category, $options: 'i' };
        }
        // Si un ingrédient est fourni, on recherche d'abord l'ID de l'ingrédient dans la collection ingredients
        if (ingredient) {
            // On recherche l'ID des ingrédients correspondant au nom de l'ingrédient
            const ingredients = await ingredientModel.find({ name: { $regex: ingredient, $options: 'i' } });
            // Si des ingrédients sont trouvés, on ajoute un filtre pour les recettes qui les contiennent
            if (ingredients.length > 0) {
                const ingredientIds = ingredients.map(ingredient => ingredient._id);
                filter.ingredients = { $in: ingredientIds };
            } else {
                return res.json({ message: "Aucun ingrédient trouvé." });
            }
        }
        // Maintenant on cherche les recettes en utilisant le filtre qu'on a constitué
        const recipes = await recipeModel.find(filter).populate('ingredients'); // On charge les ingrédients associés
        // Si des recettes sont trouvées, on les retourne, sinon on renvoie un message
        if (recipes.length > 0) {
            res.json(recipes);
        } else {
            res.json({ message: "Aucune recette trouvée." });
        }
    } catch (error) {
        res.json({ message: error.message });
    }
};
