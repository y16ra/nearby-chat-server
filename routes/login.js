var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	// ログインページ表示
	res.render('login');
});


module.exports = router;
