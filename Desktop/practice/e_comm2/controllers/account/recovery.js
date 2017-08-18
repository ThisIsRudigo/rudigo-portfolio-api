var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

var authenticate = require('../../authenticate');
var User = require('../../models/user');


/*** END POINT FOR REQUESTING PASSWORD CHANGE USING EMAIL */
router.post('/', function(req, res){
    async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({email: req.body.email}, function (err, user, info) {
                    if (err){
                        res.error(error);
                    }
                    if (!user) {
                        return res.status(401).json({
                            err: info
                        });
                    }
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 360000;

                    user.save(function (err) {
                        done(err, token, user);
                    });
                });
            },
            function (token, user, done) {
                var smtpTransport = nodemailer.createTransport({

                    service: 'Gmail',
                    auth:{
                        user: 'teylormade17',
                        pass: 'ayaosi17'
                    }
                });
                var  mailOptions = {
                    to: user.email,
                    from:'passwordreset@demo.com',
                    subject: 'TeylorMade Password Reset',
                    text: 'You are receiving this because you (or someone) have requested for a password reset for your account.\n\n'+
                    'Please click on the following link, or paste this into your browser to complete the process: \n\n' +
                    'http://'+ req.headers.host + "/account/recovery/change-password/" + token + '\n\n ' +
                    'if you did not request this, please ignore this email and your password will remain unchanged. \n'
                };
                smtpTransport.sendMail(mailOptions, function (err) {
                    if (err){
                        res.error(error);
                    }

                    res.send('an email has been sent to '+ user.email+ ' with further instructions.');
                    done(err, 'done');
                });
            }
        ], function (err) {
            if (err){
                res.error(error);
            }
        }
    )
});

/*** END POINT FOR UPDATING PASSWORD ONCE THE PASSWORD RESET EMAIL HAS BEEN SENT **MAY NOT BE NECESSARY** */
router.post('/change-password/:token', function(req, res) {
    async.waterfall([
        function (done) {
            User.findOne({
                resetPasswordToken: req.params.token,
                resetPasswordExpires: {$gt: Date.now()}
            }, function (err, user) {
                if (err){
                    res.error(error);
                }
                if (!user) {
                    return res.send('Error: PasswordResetToken is invalid or has expired! please try AGAIN!.');
                }

                /*user.setPassword(req.body.password, () => {*/
                user.setPassword(req.body.password, function (err) {
                    if (err) {
                        return next(err);
                    }
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(function (err) {
                        if (err) {
                            return res.error(error);
                        }

                        req.login(user, function (err) {
                            done(err, user);
                        });
                    });
                })
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({

                service: 'Gmail',
                auth: {
                    user:'teylormade17',
                    pass:'ayaosi17'
                }
            });
            var  mailOptions = {
                to: user.email,
                from:' ',
                subject: 'TeylorMade Password Reset ',
                text:'Hello,\n\n'+
                ' This is a confirmation that the password for your account '+ user.email+' was successfully CHANGED'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                if (err){
                    res.error(error);
                }
                res.send('SUCCESS: YOUR PASSWORD HAS BEEN CHANGED');
                done(err);
            })
        }
    ])
});

module.exports = router;
