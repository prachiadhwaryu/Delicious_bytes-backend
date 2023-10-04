var express = require('express');
var router = express.Router();
const Users = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', async(req, res)=> {
  const user = new Users(req.body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch (error) {
    res.status(500).send(error)
  }
});


module.exports = router;
