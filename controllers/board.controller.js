var Board = require('../models/board.model');
var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");


module.exports.index = async function(req, res){
	var boardId = req.body.boardId;

	var lists = await List.find({boardId: boardId});
	lists = lists.map((list)=>{
		return {
			_id: list.id,
			title: list.title,
			cardCount: list.cardCount,
			boardId: list.boardId
		}
	});
	
	res.render('board',{
		boards: boards,
		recents:recents,
		groups:groups

	});

}
module.exports.create = async (req, res)=>{
	var userId = req.signedCookies.userId;
	var title = req.body.title;
	var timeCreated = new Date().getTime();
	var groupId = req.body.groupId;

	console.log("// " + groupId)

	if (groupId == "#null"){
		var boardType = BOARD_TYPE.PRIVATE;
	}
	else {
		var boardType = BOARD_TYPE.SHARED;
	};

	var board = new Board({
		title: title,
		boardType: boardType,
		groupId: groupId,
		userId: userId
	});

	try {
		board.save();
		res.redirect("/home");
	}
	catch (e){

	}
};

module.exports.list = async function(req, res) {
	var lists = await List.find();
	res.render('list',{
		lists: lists
	});
};
