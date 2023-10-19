const mongoose = require('mongoose');

const mealCategoryListSchema = new mongoose.Schema({
    value: {
    type: String,
    required: true,
  },
});

const MealCategoryList = mongoose.model('MealCategoryList', mealCategoryListSchema, 'meal_category_list');

module.exports = MealCategoryList;