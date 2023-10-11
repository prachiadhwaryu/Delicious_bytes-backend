const mongoose = require('mongoose');

const timeCategoryListSchema = new mongoose.Schema({
    value: {
    type: String,
    required: true,
  },
});

const TimeCategoryList = mongoose.model('TimeCategoryList', timeCategoryListSchema, 'time_category_list');

module.exports = TimeCategoryList;