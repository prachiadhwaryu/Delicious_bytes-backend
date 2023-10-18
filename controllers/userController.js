const Users = require('../models/users.model'); 
const asyncHandler = require('express-async-handler');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SecretQuestions = require('../models/secretQuestions.model');

const secretKey = 'loyalist';


// asynchronous API request - To check if email already exists in the database or it's unique
exports.user_check_email = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ email });

        if (user) {
            return res.status(409).json({ message: 'Email is already in use' });  // Email is already registered
        }
        res.status(200).json({ message: 'Email is available' });        // Email is available
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Register new user
exports.user_registration = asyncHandler(async (req, res, next) => {
    const { first_name, last_name, email, password, confirmPassword } = req.body;

    if(password === confirmPassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Users({ first_name, last_name, email, password: hashedPassword });
        try {
            await user.save()
            res.status(201).send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    } else {
        res.status(400).json({ error: 'Passwords do not match' });
    }
});

// Set Security Questions and Answers
exports.select_secret_question = asyncHandler(async (req, res) => {
    try {
        const questionIds = req.query.questionIds; // This will be an array of question IDs
    
        // Query the secret_questions collection based on the provided question IDs
        const questions = await SecretQuestions.find({ _id: { $nin: questionIds } });
    
        // Send the retrieved questions as a JSON response
        res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

exports.save_secret_asnwers = asyncHandler(async (req, res) => {
    try {
        const { userId, secretQuestions } = req.body; 
    
        const user = await Users.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Iterate through the provided secretQuestions array
        for (const sq of secretQuestions) {
          const { questionId, answer } = sq;
    
          // Ensure the provided questionId exists in the SecretQuestions collection
          const question = await SecretQuestions.findById(questionId);
          if (!question) {
            return res.status(400).json({ message: 'Invalid question ID : ' + questionId});
          }
    
          // Hash the answer using bcrypt
          const hashedAnswer = await bcrypt.hash(answer, 10);
    
          const newSecretQuestion = {
            question: questionId,
            answer: hashedAnswer,
          };
    
          // Push the new secret question to the user's secretQuestions array
          user.secret_questions.push(newSecretQuestion);
        }

        await user.save();
    
        res.status(200).json({ message: 'Secret questions and answers stored successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    
});

// Login user using email and password
exports.user_login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
    
        if (!user) {
          return res.status(401).json({ error: 'Not a valid user.' });
        }
    
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Authentication failed - Incorrect Password.' });
        }
    
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    
        const response = {
            token,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture: user.profile_picture || null, 
        };
      
        res.status(200).json(response);
      } catch (error) {
        console.error(error.stack);
        res.status(500).json({ error: 'Authentication failed' });
      }
});

exports.forgot_password = asyncHandler(async (req, res) => {
    try {
        const userEmail = req.query.email; 
        console.log(userEmail);

        const user = await Users.findOne({ email: userEmail });
    
        if (!user) {
          return res.status(404).json({ error: 'Invalid email id or no user is registered with given email id.' });
        }
    
        const secretQuestions = user.secret_questions;
        if (!secretQuestions || secretQuestions.length === 0) {
            return res.status(404).json({ error: 'User has not set secret questions' });
        }

        const randomIndex = Math.floor(Math.random() * secretQuestions.length);
        const randomQuestionId = secretQuestions[randomIndex].question;

        const question = await SecretQuestions.findById(randomQuestionId);

        res.status(200).json({ question_id: question._id, question: question.value });

      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
});

exports.verify_secret_answer = asyncHandler(async (req, res) => {
    try {
      const userEmail = req.body.email;
      const secretQuestionId = req.body.question_id;
      const providedAnswer = req.body.answer;
  
      const user = await Users.findOne({ email: userEmail });
  
      if (!user) {
        return res.status(404).json({ error: 'Invalid email id or no user is registered with given email id.' });
      }
  
      const secretQuestion = user.secret_questions.find(sq => sq.question.toString() === secretQuestionId);
  
      if (!secretQuestion) {
        return res.status(404).json({ error: 'Secret question not found.' });
      }
  
      const isAnswerCorrect = await bcrypt.compare(providedAnswer, secretQuestion.answer);
  
      if (isAnswerCorrect) {
        return res.status(200).json({ message: 'Answer is correct.' });
      } else {
        return res.status(401).json({ error: 'Answer is incorrect.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

exports.reset_password = asyncHandler(async (req, res) => {
    try {
      const userEmail = req.body.email;
      const newPassword = req.body.new_password;
      const confirmPassword = req.body.confirm_password;
  
      const user = await Users.findOne({ email: userEmail });
  
      if (!user) {
        return res.status(404).json({ error: 'Invalid email id or no user is registered with given email id.' });
      }
  
      if(newPassword === confirmPassword) {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
    
        await user.save();
    
        return res.status(200).json({ message: 'Password changed successfully.' });
      } else {
        res.status(400).json({ error: 'Passwords do not match' });
      }
    }catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
