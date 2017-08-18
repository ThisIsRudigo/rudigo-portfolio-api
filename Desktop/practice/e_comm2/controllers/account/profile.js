var express = require('express');
var router = express.Router();

var User = require('../../models/user');
var Verify = require('../../routers/verify');


/*** END POINT FOR GETTING PROFILE OF CURRENTLY LOGGED IN USER */
router.get('/',Verify.verifyOrdinaryUser, function(req, res){

        User.findById(req.user_id, function(err, profile) {
            if (err) {
                return res.status(401).json({
                    message: 'You are not authenticated and cannot perform the action '
                });
            }
            if (!profile){
                var err = new Error('you are not authorized');
                err.status = 403;
                return next(err);
            }
            res.json(profile);
        });
    });

/*** END POINT FOR UPDATING PROFILE OF CURRENTLY LOGGED IN USER */
router.put('/',Verify.verifyOrdinaryUser, function(req, res){

    User.findByIdAndUpdate(req.user_id, {
        $set: req.body
    }, {
        new: true
    }, function (err, profile) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        res.json(profile);
    })
});

/*** END POINT FOR FOR REQUESTING PASSWORD CHANGE BY LOGGED IN USER */
router.post('/edit_password',Verify.verifyOrdinaryUser, function(req, res){

    User.findById(req.user_id, function(err, user) {
        if (err) {
            return res.status(401).json({
                message: 'You are not authenticated and cannot perform the action '
            });
        }
        user.setPassword(req.body.password, function(err) {
            if (!req.body.password) {
                return res.status(403).json({
                    message: 'please enter your new password'
                });
            }
            user.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }
                res.send('password! SUCCESSFULLY CHANGED');
            });
        });
    });
});


module.exports = router;