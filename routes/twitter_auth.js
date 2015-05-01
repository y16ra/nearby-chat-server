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
  debug("serializeUser : " + user);
	done(null, user);
});

passport.deserializeUser(function(user, done) {
  debug("deserializeUser : " + user);
	done(null, user);
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY || conf.twitter.consumerKey,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || conf.twitter.consumerSecret,
    callbackURL: process.env.TWITTER_CALLBACK_URL || conf.twitter.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    debug("twitter profile -> " + JSON.stringify(profile._json));
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
        user.twitter = JSON.stringify(profile._json);
        // ユーザ情報を更新してMongoDBに保存
    		user.save(function(err){
    			// エラー処理
    			if (err) {
				  	return done(err, false);
    			} else {
            return done(null, user);
          }
    		});
    	});
  }
));


/* GET home page. */
router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/loby',
                                     failureRedirect: '/login' }));



module.exports = router;
