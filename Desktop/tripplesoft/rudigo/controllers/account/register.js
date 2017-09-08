var express = require('express');
var router = express.Router();

var config = require('../../config');
var FirebaseAuth = require('firebaseauth');
var firebase = new FirebaseAuth(config.FIREBASE_API_KEY);

var User = require('../../models/user');

/** ENDPOINT FOR REGISTRATION */
router.post('/superAdmin', function(req,res){
 
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;
    var accountType = req.body.accountType;

    if (typeof(email) !== 'string'){
        return res.badRequest('Email is required');
    }
    if (typeof(password) !== 'string'){
        return res.badRequest('Password is required');
    }
    if (typeof(name) !== 'string'){
        return res.badRequest('Name is required');
    }

    var allowedAccountTypes = ["student", "admin", "adminSuper"];
    if (accountType && allowedAccountTypes.indexOf(accountType.toLowerCase()) < 0){
        return res.badRequest("Account type is required");
    }

    var extras = {
        name: name,
        requestVerification: true
    };

    firebase.registerWithEmail(email, password, extras, function(err,response){
        if(err){
            console.log(err);
            return res.badRequest(err.message);
        }

        var info = {
            _id: response.user.id,
            name: response.user.displayName,
            email: response.user.email,
            accountType: accountType
        };

        User.create(info, function(err, user){
            if(err){
                console.log(err);
                return res.badRequest("Something unexpected happened");
            }
            var info = {
                name: user.displayName,
                accountType: user.accountType,
                token: response.token,
                refreshToken: response.refreshToken,
                expiryMilliseconds: response.expiryMilliseconds
            };

            res.success(info);
        });
    });
});

/*** END POINT FOR LOGIN WITH FACEBOOK */
router.post('/business', function(req, res){
    var email = req.body.email,
        password = req.body.password,
        name = req.body.name,
        businessType = req.body.businessType;

    if (typeof(email) !== 'string'){
        return res.badRequest('Email is required');
    }
    if (typeof(password) !== 'string'){
        return res.badRequest('Password is required');
    }
    if (typeof(name) !== 'string'){
        return res.badRequest('Name is required');
    }
    if (typeof(businessType) !== 'string'){
        return res.badRequest('businessType is required');
    }

    var extras = {
        name: name,
        requestVerification: true
    };

    firebase.registerWithEmail(email, password, extras, function(err,response){
        if(err){
            console.log(err);
            return res.badRequest(err.message);
        }

        var info = {
            _id: response.user.id,
            name: response.user.displayName,
            email: response.user.email
        };

        User.create(info, function(err, user){
            if(err){
                console.log(err);
                return res.badRequest("Something unexpected happened");
            }
            var info = {
                name: user.displayName,
                accountType: user.accountType,
                businessType: user.businessType,
                token: response.token,
                refreshToken: response.refreshToken,
                expiryMilliseconds: response.expiryMilliseconds
            };

            res.success(info);
        });
    });
});


module.exports = router;