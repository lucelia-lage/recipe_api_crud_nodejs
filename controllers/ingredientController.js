
//COMMENTAIRES REALISES PAR COPILOT (mais compris par moi)
const ingredientModel = require("../models/ingredientModel"); // importation du modèle d'ingrédient
const recipeModel = require("../models/recipeModel"); // importation du modèle de recette

exports.postIngredient = async (req, res) => { // req: requête envoyée par le client, res: réponse que l'on va envoyer au client
    try { // on essaie d'exécuter le code suivant
        req.body.recipe = req.params.id // on ajoute l'id de la recette dans le corps de la requête / params ça veut dire que c'est un paramètre de l'url -> /ingredients/:id
        const newIngredient = new ingredientModel(req.body); // cette ligne crée un nouvel ingrédient avec le corps de la requête
        await newIngredient.save(); // on sauvegarde le nouvel ingrédient dans la base de données
        await recipeModel.updateOne({ _id: req.params.id }, { $push: { ingredients: newIngredient._id } }) // on met à jour la recette en ajoutant l'id du nouvel ingrédient dans le tableau d'ingrédients de la recette
        res.json({ message: "ingredient created", ingredient: newIngredient }); // on renvoie un message de succès et l'ingrédient créé
    } catch (error) { // si une erreur se produit, on renvoie un message d'erreur
        res.json(error.message); // on renvoie le message d'erreur
    } // le postIngredient est une fonction asynchrone qui permet de créer un nouvel ingrédient dans la base de données
} 

exports.getIngredientsByReciper = async (req, res) => { // récupérer les ingrédients d'une recette
    try { 
        const ingredientReciper = await ingredientModel.findById(req.params.id).populate("recipe"); // on cherche l'ingrédient par son id et on le peuple avec la recette
        res.json(ingredientReciper); // on renvoie l'ingrédient trouvé
    } catch (error) { // si une erreur se produit, on renvoie un message d'erreur
        res.json({ message: error.message }); 
    } //fonction asynchrone 
}

exports.putIngredient = async (req, res) => { // mettre à jour un ingrédient
    try { 
        const ingredient = await ingredientModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true }); // on cherche l'ingrédient par son id et on le met à jour avec le corps de la requête / runValidators: true permet de valider les données avant de les mettre à jour, new: true permet de renvoyer l'ingrédient mis à jour
        res.json(ingredient) // on renvoie l'ingrédient mis à jour
    }
    catch (error) { 
        res.json({ message: error.message }); 
    }
}

exports.deleteIngredient = async (req, res) => { // supprimer un ingrédient
    try {
        const deletedIngredient = await ingredientModel.findByIdAndDelete(req.params.id); // on cherche l'ingrédient par son id et on le supprime
        await recipeModel.findByIdAndUpdate(req.params.recipeid, { $pull: { ingredients: req.params.id } }); // on met à jour la recette en supprimant l'id de l'ingrédient dans le tableau d'ingrédients de la recette
        res.json({ message: "Ingrédient supprimé" });
    } catch (error) {
        res.json({ message: error.message });
    }
}