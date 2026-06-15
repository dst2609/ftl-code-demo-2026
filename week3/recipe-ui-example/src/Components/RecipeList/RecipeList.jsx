import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../RecipeCard/RecipeCard";
import RecipeModal from "../RecipeModal/RecipeModal";

const RECIPES_URL =
  "https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast";

const RECIPE_DETAILS_URL =
  "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const RecipeList = () => {
  //useState variable to store response and store selected recipe
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    //fetch recipes
    const fetchRecipes = async () => {
      const response = await axios.get(RECIPES_URL);
      setRecipes(response.data.meals);
    };
    fetchRecipes();
  }, []);

  const handleRecipeClick = async (recipeId) => {
    const response = await axios.get(`${RECIPE_DETAILS_URL}${recipeId}`);

    setSelectedRecipe(response.data.meals[0]);
  };

  return (
    <section>
      <h2>Recipes</h2>
      <div className="recipe-container">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            onClick={() => handleRecipeClick(recipe.idMeal)}
          />
        ))}
      </div>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </section>
  );
};

export default RecipeList;
