const API_URL = 'http://localhost:3000/recipes';
let editingId = null;
let currentViewedId = null;

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

document.getElementById('recipe-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const ingredients = Array.from(document.querySelectorAll('.ingredient-row')).map(row => ({
    name: row.querySelector('.ingredient-name').value,
    quantity: row.querySelector('.ingredient-quantity').value
  }));

  const imageInput = document.getElementById('image');
  const file = imageInput.files[0];

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

  const sendRecipe = async (finalRecipe) => {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalRecipe)
    });

    const newRecipe = await res.json();
    const recipeId = newRecipe.recipe ? newRecipe.recipe._id : newRecipe._id;

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
    const reader = new FileReader();
    reader.onloadend = () => {
      recipe.image = reader.result;
      sendRecipe(recipe);
    };
    reader.readAsDataURL(file);
  } else {
    sendRecipe(recipe);
  }
});

function resetForm() {
  editingId = null;
  document.getElementById('recipe-form').reset();
  document.getElementById('ingredients-container').innerHTML = '';
}

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

function showRecipeDetail(id) {
  currentViewedId = id;

  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(recipe => {
      const container = document.getElementById('recipe-detail');
      const ingredientsList = recipe.ingredients.map(ing => `${ing.name} (${ing.quantity})`).join(', ');

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

      document.getElementById('modal').classList.remove('hidden');
    });
}

document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('modal').classList.add('hidden');
});

document.getElementById('edit-btn').addEventListener('click', () => {
  fetch(`${API_URL}/${currentViewedId}`)
    .then(res => res.json())
    .then(recipe => {
      editingId = currentViewedId;
      document.getElementById('title').value = recipe.title;
      document.getElementById('instructions').value = recipe.instructions;
      document.getElementById('preparation_time').value = recipe.preparation_time;
      document.getElementById('cook_time').value = recipe.cook_time;
      document.getElementById('difficulty').value = recipe.difficulty;
      document.getElementById('category').value = recipe.category;

      // Afficher les ingrédients
      const ingredientsContainer = document.getElementById('ingredients-container');
      ingredientsContainer.innerHTML = '';
      recipe.ingredients.forEach(ingredient => {
        const div = document.createElement('div');
        div.classList.add('ingredient-row');
        div.innerHTML = `
          <input type="text" value="${ingredient.name}" class="ingredient-name" required>
          <input type="text" value="${ingredient.quantity}" class="ingredient-quantity" required>
        `;
        ingredientsContainer.appendChild(div);
      });

      document.getElementById('modal').classList.add('hidden');
    });
});

loadRecipeTitles();

