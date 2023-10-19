var express = require('express');
var router = express.Router();
const listsController = require('../controllers/listsController');


router.get('/cuisine-list', listsController.get_cuisine_list);

router.get('/meal-category-list', listsController.get_meal_category_list);

router.get('/recipe-type-list', listsController.get_recipe_type_list);

router.get('/special-equipmment-list', listsController.get_special_equipment_list);

router.get('/time-category-list', listsController.get_time_category_list);

module.exports = router;