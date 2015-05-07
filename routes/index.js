var debug = require('debug')('nearby-chat-server:index');
var express = require('express');
var router = express.Router();
// 外部コマンドを実行する
var exec  = require('child_process').exec;
var conf = require('config');

/* GET home page. */
router.get('/', function(req, res) {
		res.redirect('/loby');
});

router.get('/loby', function(req, res) {
	if (!req.isAuthenticated()) {
		return res.redirect('/login');
	}
	// ロビーページ表示
	res.render('index', { title: 'Loby', image_url: req.user.profile_image_url });
});

// for GitHub webhook
//router.all('/webhook', function(req, res) {
//    debug("data -> " + JSON.stringify(req.data));
//    var cmd = exec("git pull", {
//        cwd: conf.deploy.dir
//    }, function(error, stdout, stderr) {
//        if (error) {
//            debug(">  ERROR (error): " + error);
//        }
//        if (stderr && error) {
//            debug(">  ERROR (error): " + error);
//        }
//        debug("> DONE! " + stdout);
//    });
//	res.send("success");
//});

/* ルーム内チャットページ */
router.get('/room/:roomId', function(req, res) {
	if (!req.isAuthenticated() || !req.user) {
		return res.redirect('/login');
	}
	// ルーム名を取得
	// モデルを定義
	var model = require('../models/model');
	var Room = model.Room;
	var roomName = "";
	Room.findOne({roomId: req.params.roomId}, function(err, data){
		if (err) {
			debug("err : " + err);
		} else {
			debug("data : " + data);
		}
		// ルーム情報を渡してページを描画
		res.render('chatRoom', { roomId: req.params.roomId, title: data.name, image_url: req.user.profile_image_url});
	});
});

module.exports = router;
