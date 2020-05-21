var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
const mongoose = require("mongoose");


module.exports.login = async function(req, res) {
	res.render('account');
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
	res.status(200);
	res.render("home", {
		groups: groups
	})
}

module.exports.register = async function(req, res) {
	res.render('register');
};
module.exports.postRegister = async function(req, res){
	var email = req.body.email;
	var displayName = req.body.displayName;
	var password = req.body.password;

	var user = await User.findOne({email: email});
	if (user != null){
		res.render("authentication/register", {
			error: [
				"Email exist"
			],
			value: req.body
		});
		return;
	}

	user = new User({
		email: email,
		password: password,
		displayName: displayName
	})

	try {
		await user.save();
		res.render("authentication/register", {
			value: req.body
		});
	}
	catch (e){
		res.render("authentication/register", {
			error: [
				"Save user fail"
			],
			value: req.body
		});
	}
}

module.exports.forgetPassword = async function(req, res){
	res.render('forgetPassword');
}
module.exports.postForgetPassword = async function(req, res){
	res.render('forgetPassword');
}
