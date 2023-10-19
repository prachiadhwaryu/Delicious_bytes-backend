var express = require('express');
var router = express.Router();
const homePageController = require('../controllers/homePageController');

router.get('/latest-recipes', homePageController.get_latest_recipes);

router.get('/top-rated-recipes', homePageController.get_top_rated_recipes);

router.get('/favourite-recipes', homePageController.get_all_time_favorite_recipes);

module.exports = router;