const Users = require('../models/users.model'); 
const Recipe = require('../models/recipes.model');
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
            return res.status(401).json({ message: 'Email is already in use' });  // Email is already registered
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
        const { email, secretQuestions } = req.body; 

        const user = await Users.findOne({ email });
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
  
  
  exports.saved_recipes = asyncHandler(async (req, res) => {
    try {
      const userId = req.userId; // This is the user ID attached by the verifyToken middleware
  
      // Find the user by ID and populate the saved recipes
      const user = await Users.findById(userId).populate('saved_recipes', '_id recipe_name images');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Extract necessary fields from the populated saved recipes
      const savedRecipes = user.saved_recipes.map(recipe => ({
        _id: recipe._id,
        name: recipe.recipe_name,
        firstImage: recipe.images[0]
        .replace(/\\/g, '/')
        .replace('uploads', '')
        .replace(/ /g, '%20'), 
      }));
  
      return res.json(savedRecipes);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });


  exports.view_basic_details = asyncHandler(async (req, res) => {
    try {
      const userId = req.userId; 

      const user = await Users.findById(userId).select('first_name last_name email phone profile_picture');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Calculate the average rating from the user's recipes
      const recipes = await Recipe.find({ chef_name: userId }).select('rating');

      if (recipes.length === 0) {
        // No recipes uploaded by the user
        const response = {
          user_name: `${user.first_name} ${user.last_name}`,
          profile_picture: user.profile_picture || 'https://cook-delicious-profiles.s3.ca-central-1.amazonaws.com/default.png',
          rating: 0 // Set default rating to 0 if no recipes found
        };
        return res.json(response);
      }

      let totalRating = 0;
      let ratedRecipes = 0;

      recipes.forEach(recipe => {
        if (recipe.rating !== undefined && recipe.rating !== null) {
          totalRating += recipe.rating;
          ratedRecipes++;
        }
      });

      const averageRating = ratedRecipes > 0 ? totalRating / ratedRecipes : 0;

      // Prepare the response object
      const response = {
        user_name: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone || '' ,
        profile_picture: user.profile_picture || 'https://cook-delicious-profiles.s3.ca-central-1.amazonaws.com/default.png',
        rating: averageRating
      };

      return res.json(response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  exports.update_basic_details = asyncHandler(async (req, res) => {
    try {
      const userId = req.userId;
      const { first_name, last_name, email, phone } = req.body;
  
      const updatedUser = await Users.findByIdAndUpdate(userId, { first_name, last_name, email, phone }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'Details Updated Successfully!' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  exports.view_chef_profile = asyncHandler(async (req, res) => {
    try {
      const userId = req.userId; 

      const user = await Users.findById(userId).select('tagline description');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const response = {
        tagline: user.tagline || '' ,
        description: user.description || ''
      };

      return res.json(response);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  exports.update_chef_profile = asyncHandler(async (req, res) => {
    try {
      const userId = req.userId;
      const { tagline, description } = req.body;
  
      const updatedUser = await Users.findByIdAndUpdate(userId, { tagline, description }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'Details Updated Successfully!' });
    } catch (error) {
      console.error('Error updating chef profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  exports.view_profile_details = asyncHandler(async (req, res) => {
    try {
      const userId = req.userId; 
  
      const user = await Users.findById(userId).select('first_name last_name profile_picture');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Calculate the average rating from the user's recipes
      const recipes = await Recipe.find({ chef_name: userId }).select('rating');

      if (recipes.length === 0) {
        // No recipes uploaded by the user
        const response = {
          user_name: `${user.first_name} ${user.last_name}`,
          profile_picture: user.profile_picture || 'https://cook-delicious-profiles.s3.ca-central-1.amazonaws.com/default.png',
          rating: 0 // Set default rating to 0 if no recipes found
        };
        return res.json(response);
      }

      let totalRating = 0;
      let ratedRecipes = 0;

      recipes.forEach(recipe => {
        if (recipe.rating !== undefined && recipe.rating !== null) {
          totalRating += recipe.rating;
          ratedRecipes++;
        }
      });

      const averageRating = ratedRecipes > 0 ? totalRating / ratedRecipes : 0;

      // Prepare the response object
      const response = {
        user_name: `${user.first_name} ${user.last_name}`,
        profile_picture: user.profile_picture || 'https://cook-delicious-profiles.s3.ca-central-1.amazonaws.com/default.png',
        rating: averageRating
      };

      return res.json(response);
    } catch (error) {
      console.error('Error fetching user profile details:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  exports.upload_profile_picture = asyncHandler(async (req, res) => {
    try {
      const userId = req.userId;
      const s3Url = req.file.location; // Get the S3 URL of the uploaded image

      // Update the user's profile_picture field in the database
      await Users.findByIdAndUpdate(userId, { profile_picture: s3Url });

      res.status(200).json({ message: 'Profile picture uploaded successfully' });

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });