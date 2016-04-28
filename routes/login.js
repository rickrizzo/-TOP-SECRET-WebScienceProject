var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var loginCtrl = require('../controllers/loginCtrl');


passport.use(new FacebookStrategy({
    clientID: '176656516048298',
    clientSecret: 'ce8c2e497fe9da446b6ddfd284dcb26e',
    callbackURL: "http://localhost:3000/fb_login/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("works");
    loginCtrl.create(profile, 200);
  }
));

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);


module.exports = router;
