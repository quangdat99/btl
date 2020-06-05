var Board = require('../models/board.model');
var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");
var Card = require("../models/card.model");
var Comment = require('../models/comment.model');

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");


module.exports.index = async function(req, res){
	var boardId = req.params.boardId;

	var board = await Board.findOne({_id: boardId})
	var lists = await List.find({boardId: boardId});

	lists = lists.map(async (list)=>{
		var cards = await Card.find({listId: list._id});
		cards = JSON.parse(JSON.stringify(cards));

		var cardIds = cards.map((card)=>card._id);
		var comments = await Comment.find({cardId: {$in: cardIds}});

		return {
			_id: list.id,
			title: list.title,
			cardCount: cards.length,
			cards: cards,
			commentsCount: comments.length
		};

	});
	board = JSON.parse(JSON.stringify(board));
	board.lists = lists;
	
	res.render('board',{
		board: board
	});

	var recent = new Recent({
		boardId: boardId,
		title: board.title,
		timeVisited: new Date().getTime(),
		userId: req.signedCookies.userId
	});
	try {
		recent.save();
	}
	catch (e) {
		console.log("save recents failed " + e.toString());
	}
}
module.exports.create = async (req, res)=>{
	var userId = req.signedCookies.userId;
	var title = req.body.title;
	var timeCreated = new Date().getTime();
	var groupId = req.body.groupId;

	var image = "/image/bg/"+(Math.floor(Math.random() *13)+1) +".jpg";
	console.log("// " + groupId)

	if (groupId == "#null" || groupId == ""){
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
