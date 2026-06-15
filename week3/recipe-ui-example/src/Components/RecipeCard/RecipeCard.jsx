import React from "react";

const RecipeCard = ({ recipe, onClick }) => {
  return (
    <button className="recipe-card" type="button" onClick={onClick}>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} />

      <h3>{recipe.strMeal}</h3>
    </button>
  );
};

export default RecipeCard;
