const mongoose = require('mongoose');

const ingredientListSchema = new mongoose.Schema({
    value: {
    type: String,
    required: true,
  },
});

const IngredientList = mongoose.model('IngredientList', ingredientListSchema, 'ingredient_list');

module.exports = IngredientList;