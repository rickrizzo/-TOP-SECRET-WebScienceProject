var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var userCtrl = require('../controllers/userCtrl');
var userModel = require('../models/userModel');


router.use(passport.initialize());
router.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: '176656516048298',
    clientSecret: 'ce8c2e497fe9da446b6ddfd284dcb26e',
    callbackURL: "http://localhost:3000/fb_login/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    userModel.findOne({'fb_id':profile.id},function(err, found){
      if(err){
        return cb(err, null);
      } else{
        if(found){
          return cb(err, found);
        }else{
          var user = new userModel({
            fb_id: profile.id,
            name: profile.displayName,
            lists: []
          });

          user.save(function(err, user){
            return cb(err, user);
          }); 
        }
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  //place user's id in cookie
  done(null, user.fb_id);
});

passport.deserializeUser(function(id, done) {
  //retrieve user from database by id
  loginCtrl.find(fb_id, function(err, user) {
    done(err, user);
  });
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);


module.exports = router;
