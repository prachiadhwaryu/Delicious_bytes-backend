const Recipe = require('../models/recipes.model');
const asyncHandler = require('express-async-handler');

exports.get_latest_recipes = asyncHandler(async (req, res) => {
    try {
        const latestRecipes = await Recipe.find()
          .sort({ upload_date: -1 }) // Sort by upload_date in descending order (latest first)
          .limit(10);

        const formattedRecipes = latestRecipes.map(recipe => ({
          _id: recipe._id,
          name: recipe.recipe_name,
          firstImage: recipe.images[0], 
        }));
    
        res.status(200).json(formattedRecipes); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
});

exports.get_top_rated_recipes = asyncHandler(async (req, res) => {
    try {
        const topRatedRecipes = await Recipe.find()
          .sort({ rating: -1 }) 
          .limit(10); 

        const formattedRecipes = topRatedRecipes.map(recipe => ({
          _id: recipe._id,
          name: recipe.recipe_name,
          firstImage: recipe.images[0], 
        }));
    
        res.status(200).json(formattedRecipes); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
});

exports.get_all_time_favorite_recipes = asyncHandler(async (req, res) => {
    try {
        const favoriteRecipes = await Recipe.find()
          .sort({ rating: -1 }) 
          .limit(10); 

        const formattedRecipes = favoriteRecipes.map(recipe => ({
          _id: recipe._id,
          name: recipe.recipe_name,
          firstImage: recipe.images[0], 
        }));
    
        res.status(200).json(formattedRecipes); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
});