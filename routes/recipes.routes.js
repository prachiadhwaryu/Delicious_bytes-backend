var express = require('express');
var router = express.Router();
const upload = require('../middleware/upload');
const recipeController = require('../controllers/recipeController');

router.post('/upload-recipe', upload.array('images', 10), recipeController.create_recipe);

//router.post('/upload-image', upload.array('images', 10), recipeController.upload_image);

router.get('/view-recipe/:recipeId', recipeController.view_recipe);

router.post('/like-recipe/:recipeId', recipeController.like_unlike_recipe);

router.post('/add-comment/:recipeId', recipeController.add_comment);

router.post('/save-recipe/:recipeId', recipeController.save_recipe);

module.exports = router;