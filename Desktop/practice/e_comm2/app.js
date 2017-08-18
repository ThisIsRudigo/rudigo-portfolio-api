const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
var mongoose = require('mongoose');
var passport = require('passport');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');


var app = express();

var config = require('./config');
var authenticate = require('./authenticate');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
    console.log('connected to e_commerce database');
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev')); //log all requests to the console

//passport config
app.use(passport.initialize());

//routers
var account = require('./routers/account');
app.use('/account', account);

var post = require('./routers/post');
app.use('/post', post);


module.exports = app;