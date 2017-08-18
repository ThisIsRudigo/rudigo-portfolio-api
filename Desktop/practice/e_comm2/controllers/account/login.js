var express = require('express');
var router = express.Router();
var passport = require("passport");
var mongoose = require('mongoose');

var authenticate = require('../../authenticate');
var User = require('../../models/user');
var Verify = require('../../routers/verify');
var config = require('../../config');
var Response = require('../../middlewares/Response');
var mongoose = require("mongoose");


/*** END POINT FOR LOGIN WITH EMAIL */
router.post('/', function(req, res){
    passport.authenticate('local', function(err, user){
        if (err){
            return next(err);
        }
        if (!user){
            return res.status(401).json({
            status: error,
            message: 'No account match the DATA given please verify and try again oe SIGNUP'  });
        }
        req.logIn(user, function(err){
            if (err){
                return res.status(500).json({
                    status: error,
                    message: 'INTERNAL SERVER! could not log in user'
                });
            }
            console.log('User in users: ', user);

            var token = Verify.getToken(user);

            res.status(200).json({
                status: 'Login successful',
                success: true,
                token: token
            });
        });
    })(req , res);
});

/*** END POINT FOR LOGIN WITH FACEBOOK */
router.post('/auth/facebook/token', function(req, res){
    passport.authenticate('facebook-token', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user){
            return res.status(401).json({
                status: error,
                message: 'No account match the DATA given please verify and try again oe SIGNUP'
            })
        }
        req.logIn(user, function (err) {
            if (err){
                return res.status(500).json({
                    status: error,
                    message: 'INTERNAL SERVER! could not log in user'                })
            }

            var token = Verify.getToken(user);

            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req,res,next);

});

/*** END POINT FOR LOGIN WITH INSTAGRAM */
router.get('/instagram', function(req, res){
    passport.authenticate('instagram-token', function (err, user) {
        if (err) {
            return res.status(401).json({
                status: error,
                message: 'an error occured please try again'
            })
        }
        if (!user){
            return res.status(401).json({
                status: error,
                message: 'No account match the DATA given please verify and try again oe SIGNUP'
            })
        }
        req.logIn(user, function (err) {
            if (err){
                return res.status(500).json({
                    status: error,
                    message: 'INTERNAL SERVER! could not log in user' })
            }

            var token = Verify.getToken(user);

            res.status(200).json({
                status: 'Login successful!',
                success: true,
                token: token
            });
        });
    })(req,res,next);
});


module.exports = router;