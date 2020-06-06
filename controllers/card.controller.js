var User = require('../models/user.model');
var List = require('../models/list.model');
var Card = require('../models/card.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var User_Group = require('../models/user_group.model');
var Recent = require("../models/recent.model");
var History = require("../models/history.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.create = async (req, res)=>{
	var userId = req.signedCookies.userId;
	var title = req.body.title;
	var listId = req.body.listId;

	var card = new List({
		title: title,
		description: 0,
		deadlineTime: -1,
		listId: listId
	});

	try {
		await card.save();
		res.send({result: "success"});
	}
	catch (e) {
		res.send("Create card failed " + e.toString());
	};
	// var user = await User.findOne({_id: req.signedCookies.userId });
	// var board = await Board.findOne({_id: boardId});


	var displayName = res.locals.user.displayName;
	var list = await List.findOne({_id: listId});
	var board = await Board.findOne({_id: list.boardId});

	var header = displayName  + " Đã thêm 1 thẻ \"" + title + "\" vào danh sách \"" + list.title + "\"";
	var history = new History({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: "",
		boardId: boardId
	});
	try {
		history.save()
	}
	catch (e){
		console.log("save history failed " + e.toString());
	}
	
};


module.exports.rename = async (req, res)=>{
	var title = req.body.title;
	var userId = req.signedCookies.userId;
	var cardId = req.body.cardId;
	var diaplayName = res.locals.user.displayName;

	try {
		await Card.updateOne({_id: cardId}, {$set: {title: title}});
		res.send({result: "success"});
	}
	catch (e){
		console.log("rename card failed " + e.toString());
	};

	var card = await Card.findOne({_id: cardId});
	var list = await List.findOne({_id: card.listId});
	var board = await Board.findOne({_id: list.boardId});

	var header = displayName  + " Đã đã đổi tên 1 thẻ sang \"" + title + "\" trong danh sách \"" + list.title + "\"";
	var history = new Recent({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: "",
		boardId: boardId
	});
	history.save()
};

module.exports.delete = async (req, res)=>{
	var listTitle = req.body.title;
	var userId = req.signedCookies.userId;
	var listId = req.body.listId;
	var boardId = req.body.boardId;
	var diaplayName = res.locals.user.displayName;

	try {
		await List.remove({_id: listId});
		res.send({result: "success"});
	}
	catch (e){
		console.log("rename list failed " + e.toString());
	}

	var header = displayName  + " Đã đã xóa 1 danh sách: " + listTitle;
	var history = new Recent({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: "",
		boardId: boardId
	});
	history.save()
};




