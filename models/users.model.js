const mongoose = require('mongoose');
const Recipes = require('./recipes.model');
const SecretQuestions = require('./secretQuestions.model');

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
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile_picture: String,
  secret_questions: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: SecretQuestions,
      },
      answer: String,
    },
  ],
  saved_recipes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Recipes',
  },
  uploaded_recipes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Recipes',
  },
  registration_date: {
    type: Date,
    default: Date.now,
  },
});

const Users = mongoose.model('Users', usersSchema, 'users');

module.exports = Users;