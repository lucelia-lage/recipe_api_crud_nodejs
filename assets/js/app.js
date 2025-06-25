const API_URL = 'http://localhost:3000/recipes';
let editingId = null; // ID de la recette en cours d'édition
let currentViewedId = null; // ID de la recette actuellement affichée

// Ajouter un nouvel ingrédient
document.getElementById('add-ingredient').addEventListener('click', () => {
  const container = document.getElementById('ingredients-container');

  const ingredientDiv = document.createElement('div');
  ingredientDiv.className = 'ingredient-row';
  ingredientDiv.innerHTML = `
    <input type="text" placeholder="Nom de l'ingrédient" class="ingredient-name" required />
    <input type="text" placeholder="Quantité" class="ingredient-quantity" required />
    <button type="button" class="remove-ingredient">Supprimer</button>
  `;
  container.appendChild(ingredientDiv);
  
  ingredientDiv.querySelector('.remove-ingredient').addEventListener('click', () => {
    container.removeChild(ingredientDiv);
  });
});

// Soumettre le formulaire
document.getElementById('recipe-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Récupérer tous les ingrédients saisis
  const ingredients = Array.from(document.querySelectorAll('.ingredient-row')).map(row => ({
    name: row.querySelector('.ingredient-name').value,
    quantity: row.querySelector('.ingredient-quantity').value
  }));

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
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalRecipe)
    });
    const newRecipe = await response.json();
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

  sendRecipe(recipe); // Envoyer la recette sans image
});

// Réinitialiser le formulaire
function resetForm() {
  editingId = null;
  document.getElementById('recipe-form').reset();
  document.getElementById('ingredients-container').innerHTML = '';
}

// Charger les titres des recettes
function loadRecipeTitles() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('recipe-titles');
      list.innerHTML = '';

      data.forEach(recipe => {
        const li = document.createElement('li');
        li.textContent = recipe.title;
        li.addEventListener('click', () => showRecipeDetail(recipe._id));
        list.appendChild(li);
      });
    });
}

// Afficher les détails d'une recette
function showRecipeDetail(id) {
  currentViewedId = id;

  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(recipe => {
      const container = document.getElementById('recipe-detail');

      const ingredientsList = recipe.ingredients.map(ing => `${ing.name} (${ing.quantity})`).join(', ');
      
      container.innerHTML = `
        <h3>${recipe.title}</h3>
        <p><strong>Ingrédients:</strong> ${ingredientsList}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <p><strong>Préparation:</strong> ${recipe.preparation_time} min</p>
        <p><strong>Cuisson:</strong> ${recipe.cook_time} min</p>
        <p><strong>Difficulté:</strong> ${recipe.difficulty}</p>
        <p><strong>Catégorie:</strong> ${recipe.category}</p>
      `;

      document.getElementById('modal').classList.remove('hidden');
    });
}

// Fermer le modal
document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
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

    document.getElementById('modal').classList.add('hidden');
    loadRecipeTitles();
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
      editingId = currentViewedId;
      
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

      document.getElementById('modal').classList.add('hidden');
    });
});

// Charger les titres au chargement de la page
loadRecipeTitles();
