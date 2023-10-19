const mongoose = require('mongoose');

const cuisineListSchema = new mongoose.Schema({
    value: {
    type: String,
    required: true,
  },
});

const CuisineList = mongoose.model('CuisineList', cuisineListSchema, 'cuisine_list');

module.exports = CuisineList;