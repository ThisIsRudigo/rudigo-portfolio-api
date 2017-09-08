
var express = require('express');
var router = express.Router();

var config = require('../../config');
var FirebaseAuth = require('firebaseauth');
var firebase = new FirebaseAuth(config.FIREBASE_API_KEY);

var User = require('../../models/user');

/** ENDPOINT FOR GETTING PROFILE OF LOGGED IN USER */

router.get('/', function(req,res){

    User.findById(req.user.id, function(err,user){
        if(err){
            return res.serverError("Something unexpected happened")
        }

        if(!user){
            return res.badRequest("User profile not set up.");
        }

        var info = {
            photo: req.user.photoUrl,
            name: req.user.displayName,
            email: req.user.email,
            address: req.user.address,
            role: req.user.role,
            phone:req.user.phoneNumber,
            stack:req.user.stack,
            week: req.user.week,
            bizType:req.user.bizType,
            status: user.status
        };

        res.success(info);
    });
});

/** ENDPOINT FOR UPDATING PROFILE OF CURRENTLY LOGGED IN USER */
router.put('/update', function(req,res){

    var name = req.body.displayName,
        address =  req.body.address,
         role = req.body.role,
         phoneNumber = req.body.phoneNumber,
         stack = req.body.stack,
          week = req.body.week,
          bizType = req.body.bizType;

     if (!name && !phoneNumber  && !email ){
        return res.badRequest("please enter values to fields you will love to update");
    }
    if (name && typeof(name) !== 'string' || name.trim().length < 2){
        return res.badRequest('Name  required');
    }
    if (phone_number && typeof(phoneNumber) !== 'number'){
        return res.badRequest('phone number is required');
    }
    var profile = [];
   
     User.findByIdAndUpdate(req.user.id, {$set: profile}, {new: true}, function(err, user) {

        if (err) {
            return res.serverError("Something unexpected happened");
        }

        if (!user) {
            return res.badRequest("User profile not set up.");
        }

      var info = {
            photo: req.user.photoUrl,
            name: req.user.displayName,
            email: req.user.email,
            address: req.user.address,
            role: req.user.role,
            phone:req.user.phoneNumber,
            stack:req.user.stack,
            week: req.user.week,
            bizType:req.user.bizType,
            status: user.status
        };

        if (name){
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            firebase.updateProfile(token, name, function (err) {
                if (err) {
                    console.log(err);
                     return res.serverError("Something unexpected happened");
                }

                res.success(info);
            });
        }
        else{
            res.success(info);
        }
    })
});

/** ENDPOINT FOR REQUESTING PASSWORD CHANGE */
router.post('/edit_password', function(req,res){

    var password = req.body.password;

    if (typeof(password) !== 'string'){
        return res.badRequest('password is required');
    }

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    firebase.changePassword(token, password, function(err, authData){
        if(err){
            return res.serverError(err.message);
        }
        else
            var info = {
                token: authData.token,
                refreshToken: authData.refreshToken
            };
            res.success(info);
    });
});
        
module.exports = router;

