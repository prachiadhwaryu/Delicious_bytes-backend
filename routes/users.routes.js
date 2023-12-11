var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/tokenVerification');
const uploadToS3_profile= require('../middleware/s3_profile');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/check-email', userController.user_check_email);

router.post('/register', userController.user_registration);

router.get('/secret-questions', userController.select_secret_question);

router.post('/save-secret-answers', userController.save_secret_asnwers);

router.post('/login', userController.user_login);

router.get('/forgot-password', userController.forgot_password);

router.post('/verify-secret-answer', userController.verify_secret_answer);

router.post('/reset-password', userController.reset_password);

router.get('/saved-recipes', verifyToken, userController.saved_recipes);

router.get('/view-basic-details', verifyToken, userController.view_basic_details);

router.post('/update-basic-details', verifyToken, userController.update_basic_details);

router.get('/view-chef-profile', verifyToken, userController.view_chef_profile);

router.post('/update-chef-profile', verifyToken, userController.update_chef_profile);

router.get('/profile-details', verifyToken, userController.view_profile_details);

router.post('/upload-profile-picture', verifyToken, uploadToS3_profile.single('profile'), userController.upload_profile_picture);

module.exports = router;
