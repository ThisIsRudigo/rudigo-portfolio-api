var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());

//all login endpoints
var login = require('../controllers/account/login');
router.use('/login', login);

//all signup endpoints
var signup = require('../controllers/account/signup');
router.use('/signup', signup);

//all profile endpoints
var profile = require('../controllers/account/profile');
router.use('/profile', profile);

//all recovery endpoints
var recovery = require('../controllers/account/recovery');
router.use('/recovery', recovery);

module.exports = router;