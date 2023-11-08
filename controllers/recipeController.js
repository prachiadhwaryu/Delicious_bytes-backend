const jwt = require('jsonwebtoken');
const Recipe = require('../models/recipes.model');
const Users = require('../models/users.model');
const asyncHandler = require('express-async-handler');
const { TokenExpiredError } = require('jsonwebtoken');
const verifyToken = require('../middleware/tokenVerification');

// Upload recipe with images
exports.create_recipe = asyncHandler(async (req, res) => {
  const userId = req.userId;
    try {
        const { recipe_name, description, prep_time, cook_time, cuisine, time_category, recipe_type, meal_category, ingredients, special_equipment, recipe_steps } = req.body;
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
          chef_name: userId ,
        });
    
        await newRecipe.save();
        res.status(200).json(recipe_name + " Saved successfully");
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
});


/*exports.upload_image = asyncHandler(async (req, res) => {
  try {
      const { _id, recipe_name, chef_name } = req.body;
      imageCounter = 1;
      //if (req.files && req.files.length > 0) {
          const imagePaths = req.files.map((file) => file.path);
      //}
      await Recipe.updateOne(
        { _id: _id }, // Find the document by _id
        { $set: { images: imagePaths } } // Update the 'image' field with the new image path
      );
      res.status(200).json(recipe_name + " Saved successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
});*/

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0) {
    if (remainingMinutes > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  } else {
    return `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }
}

exports.view_recipe = asyncHandler(async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    let userId = null;

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const secretKey = process.env.JWT_SECRET;

      try {
        const decoded = jwt.verify(token, secretKey);
        userId = decoded.userId;
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          console.error('Token has expired');
        } else {
          console.error('Invalid token');
        }
      }
    }

    const recipe = await Recipe.findById(recipeId)
      .populate({
        path: 'cuisine',
        select: 'value -_id',
      })
      .populate({
        path: 'time_category',
        select: 'value -_id',
      })
      .populate({
        path: 'recipe_type',
        select: 'value -_id',
      })
      .populate({
        path: 'meal_category',
        select: 'value -_id',
      })
      .populate({
        path: 'special_equipment',
        select: 'value -_id',
      })
      .populate({
        path: 'chef_name',
        model: 'Users',
        select: 'first_name last_name',
      })
      .populate({
        path: 'comments.commenter',
        model: 'Users',
        select: 'first_name last_name',
      })
      .exec();

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    recipe.view_count = (recipe.view_count || 0) + 1;
    await recipe.save();

    const response = {
      _id: recipe._id,
      name: recipe.recipe_name,
      description: recipe.description,
      prep_time: formatDuration(recipe.prep_time),
      cook_time: formatDuration(recipe.cook_time),
      total_time: formatDuration(recipe.total_time),
      cuisine: recipe.cuisine ? recipe.cuisine.value : null,
      time_category: recipe.time_category.map((tc) => tc.value),
      recipe_type: recipe.recipe_type.map((rt) => rt.value),
      meal_category: recipe.meal_category.map((mc) => mc.value),
      ingredients: recipe.ingredients,
      special_equipment: recipe.special_equipment.map((se) => se.value),
      recipe_steps: recipe.recipe_steps,
      images: recipe.images.map((image) =>
        image.replace(/\\/g, '/').replace('uploads', '').replace(/ /g, '%20')
      ),
      chef_name: {
        id: recipe.chef_name._id,
        name: `${recipe.chef_name.first_name} ${recipe.chef_name.last_name}`,
      },
      comments: recipe.comments.map((comment) => ({
        commenter: `${comment.commenter.first_name} ${comment.commenter.last_name}`,
        comment: comment.comment,
      })),
      recipe_video: recipe.recipe_video,
      upload_date: recipe.upload_date,
      view_count: recipe.view_count,
      likes_count: recipe.likes.length,
      rating: recipe.rating !== undefined ? recipe.rating : 0,
    };

    if(userId){
      let is_saved = false;
      let is_liked = false;
      let is_rated = false;
      is_liked = userId && recipe.likes.includes(userId);
      
      const user = await Users.findById(userId);
      if (user && user.saved_recipes.includes(recipeId)) {
        is_saved = true;
      }

      is_rated = recipe.ratings.find((rating) => rating.user_id.toString() === userId.toString());
      if(is_rated)
        is_rated = true;

      response.is_liked = is_liked,
      response.is_saved = is_saved,
      response.is_rated = is_rated
    }

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

exports.like_unlike_recipe = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;

    const recipeId = req.params.recipeId;
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const userIndex = recipe.likes.indexOf(userId);

    if (userIndex === -1) {
      // User hasn't liked the recipe, so add their ID to the likes array
      recipe.likes.push(userId);
    } else {
      // User has already liked the recipe, so remove their ID from the likes array (unlike)
      recipe.likes.splice(userIndex, 1);
    }

    await recipe.save();
    res.status(200).json({ message: 'Like/Unlike operation successful' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

exports.add_comment = asyncHandler(async (req, res) => {
  try {
    const { comment } = req.body;
    const recipeId = req.params.recipeId;
    const userId = req.userId;

      const recipe = await Recipe.findById(recipeId);

      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const newComment = {
        commenter: userId,
        comment,
      };
    
      recipe.comments.push(newComment);

      await recipe.save();
      res.status(200).json({ message: 'Comment added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

exports.save_recipe = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;

    const recipeId = req.params.recipeId;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipeIndex = user.saved_recipes.indexOf(recipeId);

    if (recipeIndex === -1) {
      // If the recipe ID is not present, add it to saved_recipes
      user.saved_recipes.push(recipeId);
    } else {
      // If the recipe ID is already present, remove it from saved_recipes
      user.saved_recipes.splice(recipeIndex, 1);
    }

    await user.save();
    res.status(200).json({ message: 'Recipe saved/unsaved successfully' });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

exports.rate_recipe = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;

    const recipeId = req.params.recipeId;
    const { rating } = req.body;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const recipe = await Recipe.findById(recipeId);
    const existingRating = recipe.ratings.find((r) => r.user_id === user);

    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this recipe' });
    }

    recipe.ratings.push({ user_id: userId, rating });
    const totalRatingValue = recipe.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatingValue / recipe.ratings.length;
    recipe.rating = averageRating;
    await recipe.save();

    res.status(200).json({ message: 'Rating saved successfully' });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


/*exports.whatsapp_share = asyncHandler(async (req, res) => {
  const { text, url } = req.query;

    if (!text || !url) {
        res.status(400).send('Both "text" and "url" parameters are required.');
        return;
    }

    const message = encodeURIComponent(`${text}\n${url}`);
    const whatsappURL = `whatsapp://send?text=${message}`;

    res.json({ whatsappURL });
});*/