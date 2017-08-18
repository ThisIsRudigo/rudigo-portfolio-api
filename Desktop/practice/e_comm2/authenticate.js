var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var InstagramTokenStrategy = require('passport-instagram-token');

var User = require('./models/user');
var config = require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((User.serializeUser()));
passport.deserializeUser((User.deserializeUser()));


//facebook authentication api engine
exports.facebook = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    profileFields: config.facebook.profileFields
},
    function (accessToken, refreshToken, profile, done) {
        User.findOneCreate({OauthId: profile.id}, function (err, user) {
            if(err) {
                console.log(err);
            }
            if (!err && user !== null){
                done(null, user);
            }else{
                user = new User({
                    username: profile.displayName,
                    picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
                    // email: profile.emails[0].value || null
                });
                
                user.OauthId = profile.id;
                user.OauthToken = accessToken;
                user.save(function (err) {
                    if (err){
                        console.log(err);
                    }else{
                        console.log('saving user');
                        done(null, user);
                    }
                });
            }
        });
    }
));

//instagram controllers
exports.instagram = passport.use(new InstagramTokenStrategy({
        clientID: config.instagram.clientID,
        clientSecret: config.instagram.clientSecret,
        passReqToCallback: config.instagram.passReqToCallback
    },
    function (request, accessToken, refreshToken, profile, done) {
        User.findOrCreate({OauthId: profile._json.id}, function (err, user) {
            if (err) throw err;

            if (!err && user !== null){
                done(null, user);
            }else{
                user = new User({
                    username: json.data.username,
                    picture: profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg',
                    email: profile._json.emails[0].value,
                    d_o_b: profile._json.birthday
                });

                user.OauthId = profile.id;
                user.OauthToken = accessToken;
                user.save(function (err) {
                    if (err){
                        console.log(err);
                    }else{
                        console.log('saving user');
                        done(null, user);
                    }
                });
            }
        });
    }
));