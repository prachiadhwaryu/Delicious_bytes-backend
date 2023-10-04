const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: String,
  saved_recipes: Number,
  uploaded_recipes: Number,
});

const Users = mongoose.model('Users', usersSchema);

module.exports = Users;