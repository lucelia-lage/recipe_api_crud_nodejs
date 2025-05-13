
// commentaires faits par copilot (mais compris par moi)
const API_URL = 'http://localhost:3000/recipes';
let editingId = null; // ID de la recette en cours d'édition
let currentViewedId = null; // ID de la recette actuellement affichée

document.getElementById('add-ingredient').addEventListener('click', () => { // Ajouter un nouvel ingrédient
  const container = document.getElementById('ingredients-container'); // Récupérer le conteneur des ingrédients
  const div = document.createElement('div'); // Créer un nouvel élément div pour l'ingrédient
  div.className = 'ingredient-row'; // Ajouter une classe pour le style
  div.innerHTML = `
    <input type="text" placeholder="Nom de l'ingrédient" class="ingredient-name" required />
    <input type="text" placeholder="Quantité" class="ingredient-quantity" required />
    <button type="button" class="remove-ingredient">Supprimer</button>
  `; // Ajouter des champs pour le nom et la quantité de l'ingrédient
  container.appendChild(div); // Ajouter le nouvel élément au conteneur
  div.querySelector('.remove-ingredient').addEventListener('click', () => { // Ajouter un événement pour supprimer l'ingrédient
    container.removeChild(div); // Supprimer l'élément du conteneur
  });
});

document.getElementById('recipe-form').addEventListener('submit', async function(e) { // Soumettre le formulaire
  e.preventDefault(); // Empêcher le rechargement de la page

  const ingredients = Array.from(document.querySelectorAll('.ingredient-row')).map(row => ({ // Récupérer tous les ingrédients saisis/ map: permet de créer un nouveau tableau en appliquant une fonction à chaque élément du tableau d'origine
    name: row.querySelector('.ingredient-name').value, // Récupérer le nom de l'ingrédient
    quantity: row.querySelector('.ingredient-quantity').value // Récupérer la quantité de l'ingrédient
  }));

  const imageInput = document.getElementById('image'); // Récupérer le champ d'image
  const file = imageInput.files[0]; // Récupérer le fichier image sélectionné

  const recipe = { // Créer un objet recette avec les données du formulaire
    title: document.getElementById('title').value, // Récupérer le titre de la recette
    ingredients: [], // Initialiser le tableau d'ingrédients
    instructions: document.getElementById('instructions').value, // Récupérer les instructions de la recette
    preparation_time: parseInt(document.getElementById('preparation_time').value), // Récupérer le temps de préparation
    cook_time: parseInt(document.getElementById('cook_time').value), // Récupérer le temps de cuisson
    difficulty: document.getElementById('difficulty').value, // Récupérer la difficulté de la recette
    category: document.getElementById('category').value, // Récupérer la catégorie de la recette
    image: "" // Initialiser l'image
  };

  const sendRecipe = async (finalRecipe) => { // Fonction pour envoyer la recette au serveur
    const method = editingId ? 'PUT' : 'POST'; // Déterminer la méthode HTTP (PUT pour mise à jour, POST pour création)
    const url = editingId ? `${API_URL}/${editingId}` : API_URL; // Déterminer l'URL (si on édite, on ajoute l'ID à l'URL)

    const res = await fetch(url, { // Envoyer la requête au serveur
      method, // Méthode HTTP
      headers: { 'Content-Type': 'application/json' }, // Type de contenu
      body: JSON.stringify(finalRecipe) // Corps de la requête avec les données de la recette
    });

    const newRecipe = await res.json(); // Récupérer la réponse du serveur
    const recipeId = newRecipe.recipe ? newRecipe.recipe._id : newRecipe._id; // Récupérer l'ID de la recette créée ou mise à jour

    for (let ing of ingredients) { // Pour chaque ingrédient
      await fetch(`http://localhost:3000/ingredients/${recipeId}`, { // Envoyer l'ingrédient au serveur
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ing)
      });
    }

    resetForm();
    loadRecipeTitles();
  };

  if (file) {
    const reader = new FileReader(); // Créer un nouvel objet FileReader pour lire le fichier image
    reader.onloadend = () => { // Quand le fichier est chargé
      recipe.image = reader.result; // Récupérer le résultat de la lecture du fichier (URL de l'image)
      sendRecipe(recipe); // Envoyer la recette avec l'image au serveur
    };
    reader.readAsDataURL(file); // Lire le fichier comme une URL de données
  } else {
    sendRecipe(recipe); // Envoyer la recette sans image au serveur
  }
});

function resetForm() { // Réinitialiser le formulaire
  editingId = null; // Réinitialiser l'ID d'édition
  document.getElementById('recipe-form').reset(); // Réinitialiser le formulaire
  document.getElementById('ingredients-container').innerHTML = ''; // Vider le conteneur des ingrédients
}

function loadRecipeTitles() { // Charger les titres des recettes
  fetch(API_URL) // Envoyer une requête GET pour récupérer toutes les recettes
    .then(res => res.json()) // Convertir la réponse en JSON
    .then(data => { // Traiter les données reçues
      const list = document.getElementById('recipe-titles'); // Récupérer la liste des titres de recettes
      list.innerHTML = ''; // Vider la liste avant d'ajouter les nouveaux titres
      data.forEach(recipe => { // Pour chaque recette
        const li = document.createElement('li'); // Créer un nouvel élément de liste
        li.textContent = recipe.title; // Ajouter le titre de la recette
        li.addEventListener('click', () => showRecipeDetail(recipe._id)); // Ajouter un événement pour afficher les détails de la recette
        list.appendChild(li); // Ajouter l'élément de liste à la liste
      });
    });
}

function showRecipeDetail(id) { // Afficher les détails d'une recette
  currentViewedId = id; // Mettre à jour l'ID de la recette actuellement affichée

  fetch(`${API_URL}/${id}`) // Envoyer une requête GET pour récupérer les détails de la recette par son ID
    .then(res => res.json()) // Convertir la réponse en JSON
    .then(recipe => { // Traiter les données reçues
      const container = document.getElementById('recipe-detail'); // Récupérer le conteneur des détails de la recette
      const ingredientsList = recipe.ingredients.map(ing => `${ing.name} (${ing.quantity})`).join(', '); // Créer une liste d'ingrédients formatée

      container.innerHTML = `
        <h3>${recipe.title}</h3>
        ${recipe.image ? `<img src="${recipe.image}" alt="Image de la recette">` : ''}
        <p><strong>Ingrédients:</strong> ${ingredientsList}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <p><strong>Préparation:</strong> ${recipe.preparation_time} min</p>
        <p><strong>Cuisson:</strong> ${recipe.cook_time} min</p>
        <p><strong>Difficulté:</strong> ${recipe.difficulty}</p>
        <p><strong>Catégorie:</strong> ${recipe.category}</p>
      `; // Ajouter les détails de la recette au conteneur

      document.getElementById('modal').classList.remove('hidden'); // Afficher le modal avec les détails de la recette
    });
}

document.getElementById('modal-close').addEventListener('click', () => { // Fermer le modal
  document.getElementById('modal').classList.add('hidden'); // Masquer le modal
});

document.getElementById('edit-btn').addEventListener('click', () => { // Éditer une recette
  fetch(`${API_URL}/${currentViewedId}`) // Envoyer une requête GET pour récupérer les détails de la recette par son ID
    .then(res => res.json()) // Convertir la réponse en JSON
    .then(recipe => {   // Traiter les données reçues
      editingId = currentViewedId;  // Mettre à jour l'ID d'édition
      document.getElementById('title').value = recipe.title;
      document.getElementById('instructions').value = recipe.instructions;
      document.getElementById('preparation_time').value = recipe.preparation_time;
      document.getElementById('cook_time').value = recipe.cook_time;
      document.getElementById('difficulty').value = recipe.difficulty;
      document.getElementById('category').value = recipe.category;

      const ingredientsContainer = document.getElementById('ingredients-container'); // Récupérer le conteneur des ingrédients
      ingredientsContainer.innerHTML = ''; // Vider le conteneur avant d'ajouter les ingrédients existants
      recipe.ingredients.forEach(ingredient => { // Pour chaque ingrédient de la recette
        const div = document.createElement('div'); // Créer un nouvel élément div pour l'ingrédient
        div.classList.add('ingredient-row'); // Ajouter une classe pour le style
        div.innerHTML = `
          <input type="text" value="${ingredient.name}" class="ingredient-name" required>
          <input type="text" value="${ingredient.quantity}" class="ingredient-quantity" required>
        `; // Ajouter des champs pour le nom et la quantité de l'ingrédient
        ingredientsContainer.appendChild(div); // Ajouter l'élément au conteneur
      });

      document.getElementById('modal').classList.add('hidden'); // Masquer le modal avec les détails de la recette
    });
});

loadRecipeTitles(); // Charger les titres des recettes au chargement de la page

