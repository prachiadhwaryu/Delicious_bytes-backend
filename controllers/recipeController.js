const Recipe = require('../models/recipes.model');
const asyncHandler = require('express-async-handler');

// Add new ingredient
/*exports.add_ingredient = asyncHandler(async (req, res) => {
    const ingredient = new IngredientList (req.body);
    try {
        await ingredient.save()
        res.status(201).send(ingredient + " added successful.");
    } catch (error) {
        res.status(500).send(error)
    }
});*/


// Upload recipe with images
exports.create_recipe = asyncHandler(async (req, res) => {
    try {
        const { recipe_name, description, prep_time, cook_time, cuisine, time_category, recipe_type, meal_category, ingredients, special_equipment, recipe_steps, chef_name } = req.body;
        imageCounter = 1;
        //if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map((file) => file.path);
        //}
        const total_time = parseInt(prep_time) + parseInt(cook_time);
    
        const newRecipe = new Recipe({
          recipe_name,
          description,
          prep_time,
          cook_time, 
          total_time,
          cuisine, 
          time_category,
          recipe_type,
          meal_category,
          ingredients,
          special_equipment,
          recipe_steps,
          images: imagePaths, // Assign the array of image paths
          chef_name,
        });
    
        await newRecipe.save();
        res.status(200).json(recipe_name + " Saved successfully");
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
});
