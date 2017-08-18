var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');


var authenticate = require('../../authenticate');
var User = require('../../models/user');


/*** END POINT FOR SIGNUP WITH EMAIL */
router.post('/', function(req, res){

    //signUp requires name, email, password, and designer flag
    User.register(new User({username : req.body.username, email: req.body.email, d_o_b: req.body.d_o_b, designation: req.body.designation}),
        req.body.password, function (err, user) {

            if (err){
                return res.status(500).json({err: err});
            }
            // if (!email || typeof(email) !== 'string'){
            //     return res.status(422).json({status: error, message: 'email is required'})
            // }
            //
            // if (!password || typeof(password) !== 'string'){
            //     return res.status(422).json({status: error, message: 'Password is required'});
            // }
            //
            // if (!designation || typeof(designation) !== 'boolean'){
            //     return res.status(422).json({status: error, message: 'Specify is user is a designer or a regular user'})
            // }
            user.save(function (err) {
                passport.authenticate('local')(req, res, function () {
                    return res.status(200).json({status: 'Registration Successful!'});
                });
                if (err){
                    return res.status(500).json({
                        err: 'could not log in user'
                    })
                }
            });
        }
    );
});

module.exports = router;

