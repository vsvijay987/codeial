const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

//tell passport to use new strategy for google login
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url,
    },
    function(accessToken, refreshToken, profile, done){
        //find user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err){ console.log("error in google strategy-passport", err); return;}

            console.log(profile);
            
            //if user found, set this user as req.user
            if (user){
                return done(null, user);
            }else{
                //if user not found, set this user as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err){ console.log("error in creating user google strategy-passport", err); return;}

                    return done(null, user);
                })
            }
        })
    }
));

module.exports = passport;