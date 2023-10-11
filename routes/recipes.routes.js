var express = require('express');
var router = express.Router();
const upload = require('../middleware/upload');
const recipeController = require('../controllers/recipeController');

router.post('/upload-recipe', upload.array('images', 10), recipeController.create_recipe);

module.exports = router;