var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());

var post = require('../controllers/post/post');
router.use('/post', post);

module.exports = router;