const mongoose = require('mongoose');

const secretQuestionSchema = new mongoose.Schema({
    value: {
    type: String,
    required: true,
  },
});

const SecretQuestions = mongoose.model('SecretQuestions', secretQuestionSchema, 'secret_questions');

module.exports = SecretQuestions;