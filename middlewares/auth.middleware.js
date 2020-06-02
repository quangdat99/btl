var User = require('../models/user.model');

module.exports.requireLogin = async function (req, res, next) {
	if (!req.signedCookies.userId) {
		res.redirect('/authentication/login');
		return;
	}

	var user = await User.findOne({_id: req.signedCookies.userId });

	if (!user.id) {
		res.redirect('/authentication/login');
		return;
	}
	next();

};

module.exports.req = async function (req, res, next) {
	if (req.signedCookies.userId) {
		var user = await User.findOne({_id: req.signedCookies.userId });
		res.locals.user = user;
	}
	
	next();

};