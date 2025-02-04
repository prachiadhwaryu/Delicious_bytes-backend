var express = require('express');
var router = express.Router();
const upload = require('../middleware/upload');
const recipeController = require('../controllers/recipeController');
const verifyToken = require('../middleware/tokenVerification');
const uploadToS3= require('../middleware/s3');

router.post('/upload-recipe', verifyToken, uploadToS3.array('images', 10), recipeController.create_recipe);

//router.post('/upload-image', upload.array('images', 10), recipeController.upload_image);

router.get('/view-recipe/:recipeId', recipeController.view_recipe);

router.post('/like-recipe/:recipeId', verifyToken, recipeController.like_unlike_recipe);

router.post('/add-comment/:recipeId', verifyToken, recipeController.add_comment);

router.post('/save-recipe/:recipeId', verifyToken, recipeController.save_recipe);

//router.get('/whatsapp-share', recipeController.whatsapp_share);

router.post('/rate-recipe/:recipeId', verifyToken, recipeController.rate_recipe);

router.get('/search', recipeController.search_recipe);

module.exports = router;