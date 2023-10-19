const CuisineList = require('../models/cuisineList.model');
const MealCategoryList = require('../models/mealCategoryList.model');
const RecipeTypeList = require('../models/recipeTypeList.model');
const SpecialEquipmentList = require('../models/specialEquipmentList.model');
const TimeCategoryList = require('../models/timeCategoryList.model');
const SecretQuestions = require('../models/secretQuestions.model');
const asyncHandler = require('express-async-handler');

// send cuisine list
exports.get_cuisine_list = asyncHandler(async (req, res) => {
    try {
      const data = await CuisineList.find({}, '_id value');
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error at cuisine list' });
    }
});

// send meal category list
exports.get_meal_category_list = asyncHandler(async (req, res) => {
    try {
      const data = await MealCategoryList.find({}, '_id value');
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error at meal category list' });
    }
});
  
// send recipe type list
exports.get_recipe_type_list = asyncHandler(async (req, res) => {
    try {
      const data = await RecipeTypeList.find({}, '_id value');
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error at recipe type list' });
    }
});

// send special equipment list
exports.get_special_equipment_list = asyncHandler(async (req, res) => {
    try {
      const data = await SpecialEquipmentList.find({}, '_id value');
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error at special equipment list' });
    }
});

// send time category list
exports.get_time_category_list = asyncHandler(async (req, res) => {
    try {
      const data = await TimeCategoryList.find({}, '_id value');
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error at time category list' });
    }
});
