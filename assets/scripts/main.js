import './RecipeCard.js';

// Part 1: Expose (A1–A11)
async function getRecipes() {
  const localKey = 'recipes';
  // A1: Try cache first
  const cached = localStorage.getItem(localKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (_) {
      // invalid JSON, fall through
    }
  }

  // A2–A9: Fetch each recipe JSON in parallel
  const recipeFiles = [
    '/recipes/1_50-thanksgiving-side-dishes.json',
    '/recipes/2_roasting-turkey-breast-with-stuffing.json',
    '/recipes/3_moms-cornbread-stuffing.json',
    '/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
    '/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  ];
  const fetches = recipeFiles.map(path => fetch(path).then(res => res.json()));
  const recipes = await Promise.all(fetches);

  // A10–A11: Cache and return
  localStorage.setItem(localKey, JSON.stringify(recipes));
  return recipes;
}

// Existing helper to render <recipe-card>
function addRecipesToDocument(recipes) {
  const main = document.querySelector('main');
  recipes.forEach(data => {
    const card = document.createElement('recipe-card');
    card.data = data;
    main.appendChild(card);
  });
}

// Part 2: Explore (Service Workers, B1–B5)
function initializeServiceWorker() {
  // B1: Check support
  if ('serviceWorker' in navigator) {
    // B2: Register on load
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        // B3: Success
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        // B4: Failure
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

// Bootstrap: load recipes then init SW
window.addEventListener('DOMContentLoaded', async () => {
  const recipes = await getRecipes();
  addRecipesToDocument(recipes);
  initializeServiceWorker();
});
