var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	// already logined.
	if (req.user) {
		return res.redirect('/loby');
	}
	// ログインページ表示
	res.render('login');
});


module.exports = router;
