const mongoose = require('mongoose');

const recipeTypeListSchema = new mongoose.Schema({
    value: {
    type: String,
    required: true,
  },
});

const RecipeTypeList = mongoose.model('RecipeTypeList', recipeTypeListSchema, 'recipe_type_list');

module.exports = RecipeTypeList;