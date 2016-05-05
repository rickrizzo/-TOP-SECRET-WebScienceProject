var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var userCtrl = require('../controllers/userCtrl');
var userModel = require('../models/userModel');
var userID;

// Initialize Passport
router.use(passport.initialize());
router.use(passport.session());

// Create Facebook Connection
passport.use(new FacebookStrategy({
    clientID: '176656516048298',
    clientSecret: 'ce8c2e497fe9da446b6ddfd284dcb26e',
    callbackURL: "http://grogro.herokuapp.com/fb_login/auth/facebook/callback"
    // Local Test App
    // clientID: '225676544479628',
    // clientSecret: '3f8786e6f9bff4d451194146869ff2a8',
    // callbackURL: "http://localhost:3000/fb_login/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    userModel.findOne({'fb_id':profile.id},function(err, found){
      if(err){
        return cb(err, null);
      } else{
        if(found){
          userID = found.fb_id;
          return cb(err, found);
        }else{
          var user = new userModel({
            fb_id: profile.id,
            name: profile.displayName,
            lists: []
          });

          user.save(function(err, user){
            userID = user.fb_id;
            return cb(err, user);
          }); 
        }
      }
    });
  }
));

// Serialize to Cookie
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Retrieve User from DB
passport.deserializeUser(function(id, done) {
  userModel.findById(id, function(err, user) {
    done(err, user);
  });
});

// Authenticate
router.get('/auth/facebook', passport.authenticate('facebook'));

// Authenitcation Callback
router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.cookie('user', userID);
    res.redirect('/#');
  }
);

// Get User
router.get('/isloggedin', function(req, res){
  if(req.cookies.user){
    userModel.find({'fb_id': req.cookies.user}, function(err, user){
      res.send(JSON.stringify(user));
    });
  }
});

// Log Out
router.get('/logout', function(req, res){
  res.clearCookie('user');
  req.logout();
  res.redirect('/#');
});

module.exports = router;
