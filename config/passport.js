const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Strategy = require('passport-facebook').Strategy;
//User model
const User = require('../models/User');
const FACEBOOK_CLIENT_ID = require('./facebookAppCredentials').facebookClientId;
const FACEBOOK_CLIENT_SECRET = require('./facebookAppCredentials')
  .facebookClientSecret;
module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //Match User
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: 'that email is not registered'
            });
          }
          //Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'password incorrect' });
            }
          });
        })
        .catch(err => console.log(err));
    })
  );

  passport.use(
    new Strategy(
      {
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/return',
        profileFields: ['emails', 'name']
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOne({ 'facebook.id': profile.id }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, user);
          }
          var newUser = new User({
            id: profile.id,
            token: accessToken,
            name: profile.name.givenName,
            email: profile.emails[0].value
          });
          // newUser.facebook.id = profile.id;
          // newUser.facebook.token = accessToken;
          // newUser.facebook.name =
          //   profile.name.givenName + ' ' + profile.name.familyName;
          // newUser.facebook.email = profile.emails[0].value;

          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        });
      }
    )
  );
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
};
