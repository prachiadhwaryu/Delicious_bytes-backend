const mongoose = require('mongoose');
const CuisineList = require('./cuisineList.model');
const TimeCategoryList = require('./timeCategoryList.model');
const RecipeTypeList = require('./recipeTypeList.model');
const MealCategoryList = require('./mealCategoryList.model');
const SpecialEquipmentList = require('./specialEquipmentList.model');
const Users = require('./users.model');

const recipesSchema = new mongoose.Schema({
    recipe_name: {
    type: String,
    required: true,
  },
  description: String,
  prep_time: {
    type: Number,
    required: true,
  },
  cook_time: {
    type: Number,
    required: true,
  },
  total_time: {
    type: Number,
    required: true,
  },
  cuisine: {
    type: mongoose.Schema.Types.ObjectId, // Id from cuisine_list
    required: true,
    ref: CuisineList,
  },       
  time_category: {
    type: [mongoose.Schema.Types.ObjectId],        // Id from time_category_list
    required: true,
    ref: TimeCategoryList,
  },
  recipe_type: {
    type: [mongoose.Schema.Types.ObjectId],        // Array of Ids from recipe_type_list
    required: true,
    ref: RecipeTypeList,
  },
  meal_category : {
    type: [mongoose.Schema.Types.ObjectId],     // Array of Ids from meal_category_list
    required: true,
    ref: MealCategoryList,
  },
  ingredients: {
    type: [String],        
    required: true,
  },
  special_equipment: {
    type: [mongoose.Schema.Types.ObjectId],  // Array of Ids from special_equipment_list
    ref: SpecialEquipmentList,
  },
  recipe_steps: {
    type: [String],
    required: true,
  },
  images: [String],
  recipe_video: String,
  upload_date: {
    type: Date, 
    default: Date.now,
  },
  chef_name: {
    type: mongoose.Schema.Types.ObjectId, // Id from users
    ref: 'Users',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId], // Id from users
    ref: 'Users',
  },
  rating: Number,
  ratings: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId, // Id from users
        ref: 'Users',
      },
      rating: Number,
    },
  ],
  view_count: Number,
  comments: [
    {
      commenter: {
        type: mongoose.Schema.Types.ObjectId, // Id from users
        ref: 'Users',
      },
      comment: String,
    },
  ],
});

const Recipes = mongoose.model('Recipes', recipesSchema, 'recipes');

module.exports = Recipes;