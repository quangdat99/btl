var Board = require('../models/board.model');
var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");


module.exports.index = async function(req, res){
	var boardId = req.params.boardId;

	var board = await Board.findOne({_id: boardId})
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
		board: board
	});
	console.log(board);

}
module.exports.create = async (req, res)=>{
	var userId = req.signedCookies.userId;
	var title = req.body.title;
	var timeCreated = new Date().getTime();
	var groupId = req.body.groupId;

	var image = "/image/bg/"+(Math.floor(Math.random() *13)+1) +".jpg";
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
		userId: userId,
		image: image
	});
	console.log(image);

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
