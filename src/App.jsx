import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []); // Only fetch recipes on initial render

  useEffect(() => {
    setFilteredRecipes(recipes);
  }, [recipes]);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleSearch = () => {
    fetchRecipes();
  };

  return (
    <div className="App">
      <h1>Recipe Website</h1>

      <div id="search-container">
        <input
          type="text"
          id="search-bar"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button id="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div id="recipes-container">
        {filteredRecipes &&
          filteredRecipes.map((recipe) => (
            <div key={recipe.idMeal} className="recipe-card">
              <h2>{recipe.strMeal}</h2>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />

              {/* Displaying Ingredients in Bullet Points */}
              <div>
                <p className="ingredients-label">Ingredients:</p>
                <ul>
                  {Array.from({ length: 20 }, (_, index) => index + 1) // Assuming a maximum of 20 ingredients
                    .filter((index) => recipe[`strIngredient${index}`]) // Filter out empty ingredients
                    .map((index) => (
                      <li key={index}>
                        {recipe[`strIngredient${index}`]} -{" "}
                        {recipe[`strMeasure${index}`]}
                      </li>
                    ))}
                </ul>
              </div>
              <p className="instructions-label">Instructions:</p>
              <p>{recipe.strInstructions}</p>
              {recipe.strYoutube && (
                <div>
                  <p className="youtube-label">Youtube Video Link:</p>
                  <button
                    onClick={() => window.open(recipe.strYoutube, "_blank")}
                    className="youtube-button"
                  >
                    Watch the Video
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
