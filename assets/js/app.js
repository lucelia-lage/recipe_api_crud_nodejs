// commentaires faits par copilot (mais compris par moi)
const API_URL = 'http://localhost:3000/recipes';
let editingId = null; // ID de la recette en cours d'édition
let currentViewedId = null; // ID de la recette actuellement affichée
// Ajouter un nouvel ingrédient
document.getElementById('add-ingredient').addEventListener('click', () => {
  const container = document.getElementById('ingredients-container'); // Récupérer le conteneur des ingrédients

  const ingredientDiv = document.createElement('div'); // Créer un nouvel élément div pour l'ingrédient
  ingredientDiv.className = 'ingredient-row'; // Ajouter une classe pour le style
  // Ajouter des champs pour le nom et la quantité de l'ingrédient
  ingredientDiv.innerHTML = `
    <input type="text" placeholder="Nom de l'ingrédient" class="ingredient-name" required />
    <input type="text" placeholder="Quantité" class="ingredient-quantity" required />
    <button type="button" class="remove-ingredient">Supprimer</button>
  `;
  // Ajouter l'élément au conteneur
  container.appendChild(ingredientDiv);
  // Ajouter un événement pour supprimer l'ingrédient
  ingredientDiv.querySelector('.remove-ingredient').addEventListener('click', () => {
    container.removeChild(ingredientDiv); // Supprimer l'élément du conteneur
  });
});
// Soumettre le formulaire
document.getElementById('recipe-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // Empêcher le rechargement de la page
  // Récupérer tous les ingrédients saisis
  const ingredients = Array.from(document.querySelectorAll('.ingredient-row')).map(row => ({
    name: row.querySelector('.ingredient-name').value, // Récupérer le nom de l'ingrédient
    quantity: row.querySelector('.ingredient-quantity').value // Récupérer la quantité de l'ingrédient
  }));
  const imageInput = document.getElementById('image'); // Récupérer le champ d'image
  const file = imageInput.files[0]; // Récupérer le fichier image sélectionné
  // Créer un objet recette avec les données du formulaire
  const recipe = {
    title: document.getElementById('title').value,
    ingredients: [],
    instructions: document.getElementById('instructions').value,
    preparation_time: parseInt(document.getElementById('preparation_time').value),
    cook_time: parseInt(document.getElementById('cook_time').value),
    difficulty: document.getElementById('difficulty').value,
    category: document.getElementById('category').value,
    image: ""
  };
  // Fonction pour envoyer la recette au serveur
  const sendRecipe = async (finalRecipe) => {
    const method = editingId ? 'PUT' : 'POST'; // Déterminer la méthode HTTP
    const url = editingId ? `${API_URL}/${editingId}` : API_URL; // Déterminer l'URL

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalRecipe)
    });
    const newRecipe = await response.json(); // Récupérer la réponse du serveur
    const recipeId = newRecipe.recipe ? newRecipe.recipe._id : newRecipe._id;
    // Envoyer les ingrédients un par un
    for (let ing of ingredients) {
      await fetch(`http://localhost:3000/ingredients/${recipeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ing)
      });
    }
    resetForm();
    loadRecipeTitles();
  };
  if (file) {
    const reader = new FileReader(); // Créer un lecteur de fichier
    reader.onloadend = () => {
      recipe.image = reader.result; // Ajouter l'image à la recette
      sendRecipe(recipe); // Envoyer la recette
    };
    reader.readAsDataURL(file); // Lire l'image
  } else {
    sendRecipe(recipe); // Envoyer la recette sans image
  }
});
// Réinitialiser le formulaire
function resetForm() {
  editingId = null; // Réinitialiser l'ID d'édition
  document.getElementById('recipe-form').reset(); // Réinitialiser le formulaire
  document.getElementById('ingredients-container').innerHTML = ''; // Vider le conteneur
}
// Charger les titres des recettes
function loadRecipeTitles() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('recipe-titles');
      list.innerHTML = ''; // Vider la liste

      data.forEach(recipe => {
        const li = document.createElement('li'); // Créer un élément de liste
        li.textContent = recipe.title;
        li.addEventListener('click', () => showRecipeDetail(recipe._id)); // Ajouter un événement
        list.appendChild(li); // Ajouter à la liste
      });
    });
}
// Afficher les détails d'une recette
function showRecipeDetail(id) {
  currentViewedId = id; // Mettre à jour l'ID courant

  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(recipe => {
      const container = document.getElementById('recipe-detail'); // Conteneur des détails

      const ingredientsList = recipe.ingredients.map(ing => `${ing.name} (${ing.quantity})`).join(', ');
      // Ajouter les détails de la recette
      container.innerHTML = `
        <h3>${recipe.title}</h3>
        ${recipe.image ? `<img src="${recipe.image}" alt="Image de la recette">` : ''}
        <p><strong>Ingrédients:</strong> ${ingredientsList}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <p><strong>Préparation:</strong> ${recipe.preparation_time} min</p>
        <p><strong>Cuisson:</strong> ${recipe.cook_time} min</p>
        <p><strong>Difficulté:</strong> ${recipe.difficulty}</p>
        <p><strong>Catégorie:</strong> ${recipe.category}</p>
      `;

      document.getElementById('modal').classList.remove('hidden'); // Afficher la modale
    });
}
// Fermer le modal
document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden'); // Masquer la modale
});

// Supprimer une recette
document.getElementById('delete-btn').addEventListener('click', async () => {
  if (!currentViewedId) return;

  if (!confirm('Voulez-vous vraiment supprimer cette recette ?')) return;

  try {
    const res = await fetch(`${API_URL}/${currentViewedId}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    console.log(data.message);

    document.getElementById('modal').classList.add('hidden'); // Fermer la modale
    loadRecipeTitles(); // Recharger les titres
    currentViewedId = null;
  } catch (err) {
    console.error('Erreur lors de la suppression :', err);
    alert('Échec de la suppression de la recette.');
  }
});


// Éditer une recette
document.getElementById('edit-btn').addEventListener('click', () => {
  fetch(`${API_URL}/${currentViewedId}`)
    .then(res => res.json())
    .then(recipe => {
      editingId = currentViewedId; // Mettre à jour l'ID d'édition
      // Remplir le formulaire avec les infos existantes
      document.getElementById('title').value = recipe.title;
      document.getElementById('instructions').value = recipe.instructions;
      document.getElementById('preparation_time').value = recipe.preparation_time;
      document.getElementById('cook_time').value = recipe.cook_time;
      document.getElementById('difficulty').value = recipe.difficulty;
      document.getElementById('category').value = recipe.category;
      // Vider et remplir les ingrédients
      const ingredientsContainer = document.getElementById('ingredients-container');
      ingredientsContainer.innerHTML = '';

      recipe.ingredients.forEach(ingredient => {
        const row = document.createElement('div');
        row.className = 'ingredient-row';
        row.innerHTML = `
          <input type="text" value="${ingredient.name}" class="ingredient-name" required>
          <input type="text" value="${ingredient.quantity}" class="ingredient-quantity" required>
        `;
        ingredientsContainer.appendChild(row);
      });

      document.getElementById('modal').classList.add('hidden'); // Fermer la modale
    });
});
// Charger les titres au chargement de la page
loadRecipeTitles();
