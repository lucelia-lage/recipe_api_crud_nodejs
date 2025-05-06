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

exports.searchRecipes = async (req, res) => { // rechercher des recettes par titre, ingrédient ou catégorie : 
    try {
        const { title, ingredient, category } = req.query; // req.query permet de récupérer les paramètres de la requête envoyée par le client (dans l'url) / title, ingredient et category sont les paramètres de recherche

        let query = {}; // query est un objet qui va contenir les critères de recherche

        if (title) {
            query.title = new RegExp(title, 'i'); // ça veut dire que la recherche est insensible à la casse (i) : donc ça va chercher dans le titre de la recette (maj et min)
        }

        if (ingredient) {
            query.ingredients = { $in: [ingredient] }; // ça veut dire que la recherche va chercher dans le tableau d'ingrédients de la recette
        }

        if (category) {
            query.category = new RegExp(category, 'i');
        }

        const recipes = await recipeModel.find(query).populate('ingredients'); // on cherche les recettes qui correspondent aux critères de recherche dans la base de données / populate permet de peupler le tableau d'ingrédients avec les données de la collection d'ingrédients
        res.json(recipes); // on renvoie les recettes trouvées
    } catch (error) {
        res.json({ error: error.message });
    }
};
