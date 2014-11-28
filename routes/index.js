var debug = require('debug')('nearby-chat-server');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	if (!req.isAuthenticated()) {
		res.redirect('/login');
	}
	// ロビーページ表示
	res.render('index', { title: 'Loby', image_url: req.user.profile_image_url });
});

/* ルーム内チャットページ */
router.get('/room/:roomId', function(req, res) {
	// ルーム名を取得

	// ルーム情報を渡してページを描画
	res.render('chatRoom', { roomId: req, title: ''});
});

module.exports = router;
