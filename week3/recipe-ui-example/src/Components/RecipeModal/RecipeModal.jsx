import React from "react";

const RecipeModal = ({ recipe, onClose }) => {
  return (
    <div className="modal-background">
      <div className="recipe-modal">
        <button className="modal-close" type="button" onClick={onClose}>
          Close
        </button>

        <img src={recipe.strMealThumb} alt={recipe.strMeal} />

        <h2>{recipe.strMeal}</h2>

        <p>
          <strong>Category:</strong> {recipe.strCategory}
        </p>

        <p>
          <strong>Area:</strong> {recipe.strArea}
        </p>

        <p>{recipe.strInstructions}</p>
      </div>
    </div>
  );
};

export default RecipeModal;
