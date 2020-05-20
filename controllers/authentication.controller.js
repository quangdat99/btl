var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');

module.exports.login = async function(req, res) {
	res.render('login');
};
module.exports.postLogin = async function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	var user = await User.findOne({email: email});
	if (user == undefined){
		res.render("authentication/login", {
			error: [
				'User does not exist!'
			],
			values: req.body
		})
		return;
	}
	if (user.password != password){
		res.render("authentication/login", {
			error: [
				'Wrong Password!'
			],
			values: req.body
		})
		return;
	}

	res.cookie("userId", user._id, {
		signed: true
	});


	var groups = null;

	res.render("home", {
		groups: groups
	})
}

module.exports.register = async function(req, res) {
	res.render('register');
};
module.exports.postRegister = async function(req, res){

}

module.exports.forgetPassword = async function(req, res){
	res.render('forgetPassword');
}
module.exports.postForgetPassword = async function(req, res){

}
