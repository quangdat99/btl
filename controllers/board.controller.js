var Board = require('../models/board.model');
var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");


module.exports.index = async function(req, res){
	var boards = await Board.find();
	var recents = await Recent.find();
	var groups = await Group.find();
	res.render('board',{
		boards: boards,
		recents:recents,
		groups:groups

	});

}
module.exports.list = async function(req, res) {
	var lists = await List.find();
	res.render('list',{
		lists: lists
	});
};
