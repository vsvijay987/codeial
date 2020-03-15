const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use new strategy for google login
passport.use(new googleStrategy({
        clientID: "70863856146-fl7oh6525j20sm41vvd4tt0jepm4csrq.apps.googleusercontent.com",
        clientSecret: "jdHAFqipv1I_EqY67JX-6IGJ",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
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