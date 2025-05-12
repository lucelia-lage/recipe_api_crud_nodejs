const API_URL = 'http://localhost:3000/recipes';
let editingId = null;

document.getElementById('add-ingredient').addEventListener('click', () => {
    const container = document.getElementById('ingredients-container');
    const div = document.createElement('div');
    div.className = 'ingredient-row';
    div.innerHTML = `
      <input type="text" placeholder="Nom de l'ingrédient" class="ingredient-name" required />
      <input type="text" placeholder="Quantité" class="ingredient-quantity" required />
      <button type="button" class="remove-ingredient">Supprimer</button>
    `;
    container.appendChild(div);
  
    div.querySelector('.remove-ingredient').addEventListener('click', () => {
      container.removeChild(div);
    });
  });  

document.getElementById('recipe-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const recipe = {
    title: document.getElementById('title').value,
    ingredients: document.getElementById('ingredients').value.split(',').map(id => id.trim()), // Garde l'ID des ingrédients
    instructions: document.getElementById('instructions').value,
    preparation_time: parseInt(document.getElementById('preparation_time').value),
    cook_time: parseInt(document.getElementById('cook_time').value),
    difficulty: document.getElementById('difficulty').value,
    category: document.getElementById('category').value,
    image: document.getElementById('image').value
  };

  const method = editingId ? 'PUT' : 'POST';
  const url = editingId ? `${API_URL}/${editingId}` : API_URL;

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe)
  })
  .then(res => res.json())
  .then(() => {
    resetForm();
    loadRecipes();
  })
  .catch(console.error);
});

function loadRecipes() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('recipes-list');
      container.innerHTML = '';
      data.forEach(recipe => {
        // Récupérer les ingrédients pour afficher les noms
        const ingredientsList = recipe.ingredients.map(ingredient => ingredient.name).join(', ');

        const div = document.createElement('div');
        div.innerHTML = `
          <h3>${recipe.title}</h3>
          <p><strong>Ingrédients:</strong> ${ingredientsList}</p>
          <p><strong>Instructions:</strong> ${recipe.instructions}</p>
          <p><strong>Préparation:</strong> ${recipe.preparation_time} min</p>
          <p><strong>Cuisson:</strong> ${recipe.cook_time} min</p>
          <p><strong>Difficulté:</strong> ${recipe.difficulty}</p>
          <p><strong>Catégorie:</strong> ${recipe.category}</p>
          <button onclick="editRecipe('${recipe._id}')">Modifier</button>
          <button onclick="deleteRecipe('${recipe._id}')">Supprimer</button>
        `;
        container.appendChild(div);
      });
    });
}

function deleteRecipe(id) {
  fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    .then(() => loadRecipes());
}

function editRecipe(id) {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(recipe => {
      editingId = recipe._id;
      document.getElementById('title').value = recipe.title;
      document.getElementById('ingredients').value = recipe.ingredients.map(ingredient => ingredient._id).join(', '); // Garder les IDs pour la modification
      document.getElementById('instructions').value = recipe.instructions;
      document.getElementById('preparation_time').value = recipe.preparation_time;
      document.getElementById('cook_time').value = recipe.cook_time;
      document.getElementById('difficulty').value = recipe.difficulty;
      document.getElementById('category').value = recipe.category;
      document.getElementById('image').value = recipe.image;
    });
}

function resetForm() {
  editingId = null;
  document.getElementById('recipe-form').reset();
}

loadRecipes();
