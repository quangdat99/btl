var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");


module.exports.login = async function(req, res) {
	res.render('authentication/login');
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

	// private board
	var privateBoards = await Board.find({boardType: BOARD_TYPE.PRIVATE, userId: user._id});
	// group & shared-board
	var groups = await Group.find({_id: user.groupId});
	var sharedBoards = [];
	for (var g in groups){
		var group = groups[g];
		var groupBoard = await Board.find({boardType: BOARD_TYPE.SHARED, groupId: group._id});
		var sBoard = {
			groupId: group._id,
			boards: JSON.parse(JSON.stringify(groupBoard))
		};
		sharedBoards.push(sBoard);
	}
	var recents = await Recent.find({userId: user._id});
	recents.sort((r0, r1)=>{
		return r1.timeVisited - r0.timeVisited
	});
	var slicer = Math.min(recents.length, MAX_RECENT);
	recents = recents.slice(0, slicer);

	// render
	// res.render("home", {
	// 	err: "none",
	// 	value: {
	// 		privateBoards: privateBoards,
	// 		sharedBoards: sharedBoards,
	// 		groups: groups,
	// 		recents: recents,
	// 	},
	// });

	res.redirect("/home")

	// post man
	// res.send({
	// 	err: "none",
	// 	value: {
	// 		privateBoards: privateBoards,
	// 		sharedBoards: sharedBoards,
	// 		groups: groups,
	// 		recents: recents,
	// 	},
	// });
}

module.exports.register = async function(req, res) {
	res.render('authentication/register');
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
		// res.render("authentication/register", {
		// 	value: req.body
		// });
		res.redirect("/authentication/login")
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
	res.render('authentication/forgetPassword');
}
module.exports.postForgetPassword = async function(req, res){
	res.render('authentication/forgetPassword');
}

module.exports.logOut=  function(req, res) {
        res.clearCookie("userId");
        res.redirect('/');
}