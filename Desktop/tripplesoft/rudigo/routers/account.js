var express = require('express');
var router = express.Router();

var protector = require('../middlewares/protector');

//all login endpoints
var login = require('../controllers/account/login');
router.use('/login', login);

//all profile endpoints
var profile = require('../controllers/account/profile');
router.use('/profile', profile);

//all recovery endpoints
var recovery = require('../controllers/account/recovery');
router.use('/recovery', recovery);

//all profile endpoints
var register = require('../controllers/account/register');
router.use('/register',  register);

//all verification endpoints
var verification = require('../controllers/account/verification');
router.use('/verification', verification);

module.exports = router;