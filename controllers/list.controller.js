var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var User_Group = require('../models/user_group.model');
var Recent = require("../models/recent.model");
var History = require("../models/history.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.create = async (req, res)=>{
	var title = req.body.title;
	var userId = req.signedCookies.userId;
	var boardId = req.body.boardId;
	var list = new List({
		title: title,
		cardsCount: 0,
		boardId: boardId
	});

	try {
		await list.save();
		res.redirect("/board/" + boardId);
	}
	catch (e) {
		res.send("Create list failed " + e.toString());
	};
	// var user = await User.findOne({_id: req.signedCookies.userId });
	// var board = await Board.findOne({_id: boardId});


	var displayName = res.locals.user.displayName;
	var board = await Board.findOne({_id: boardId});

	var header = displayName  + " Đã thêm danh sách \"" + title + "\" vào bảng \"" + board.title + "\"";
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
	var listId = req.body.listId;
	var diaplayName = res.locals.user.displayName;

	try {
		await List.updateOne({_id: listId}, {$set: {title: title}});
		res.send({result: "success"});
	}
	catch (e){
		console.log("rename list failed " + e.toString());
	}

	var list = await List.findOne({_id: listId});
	var header = displayName  + " Đã đã đổi tên 1 danh sách sang \"" + title + "\"";
	var history = new Recent({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: "",
		boardId: list.boardId
	});
	history.save()
};

module.exports.delete = async (req, res)=>{
	var listTitle = req.body.title;
	var userId = req.signedCookies.userId;
	var listId = req.body.listId;
	var displayName = res.locals.user.displayName;

	try {
		await List.remove({_id: listId});
		res.send({result: "success"});
	}
	catch (e){
		console.log("rename list failed " + e.toString());
	}

	var list = await List.findOne({_id: listId});
	var header = displayName  + " Đã đã xóa 1 danh sách: " + listTitle;
	var history = new Recent({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: "",
		boardId: list.boardId
	});
	history.save()
};




