var debug = require('debug')('nearby-chat-server:twitter');
var express = require('express');
var session = require('express-session');
var router = express.Router();

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var model = require('../models/model');
var User = model.User;

var conf = require('config');

// Passport sessionのセットアップ
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new TwitterStrategy({
    consumerKey: "Sm5w2BnHANIvLNGF5PR6Qbvee",
    consumerSecret: "f68gFehXC3QppITjS0lpxxr3qXsAxTcAUlJlt0ouOcNcTFZXdv",
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
  	// ユーザデータを作成する
    User.findOne(
    	{twitter_id: profile._json.id}, 
    	function (err, result) {
    		user = new User();
    		if (result) {
    			user = result;
    		}
    		user.twitter_id = profile._json.id;
    		user.token = token;
    		user.token_secret = tokenSecret;
    		user.userName = profile.username;
    		user.profile_image_url = profile._json.profile_image_url.replace('_normal','');

    		user.save(function(err){
    			// エラー処理
    			if (err) {
				  	return done(err, false);
    			}
    		});
		  	return done(null, user);
    	});
  }
));


/* GET home page. */
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));



module.exports = router;
