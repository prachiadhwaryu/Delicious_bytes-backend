var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/check-email', userController.user_check_email);

router.post('/register', userController.user_registration);

router.get('/secret-questions', userController.select_secret_question);

router.post('/save-secret-answers', userController.save_secret_asnwers);

router.post('/login', userController.user_login);

module.exports = router;
