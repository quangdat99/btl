var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var User_Group = require('../models/user_group.model');
var Recent = require("../models/recent.model");
var List = require("../models/list.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.create = async (req, res)=>{
	var title = req.params.title;
	var userId = req.signedCookies.userId;
	var boardId = req.params.boardId;

	var list = new List({
		title: title,
		cardsCount: 0,
		boardId: boardId
	});

	try {
		await list.save();
		res.redirect("/group/" + groupId);
	}
	catch (e) {
		res.send("Create list failed " + e.toString());
	};

	var displayName = req.locals.user.displayName;
	var board = await Board.find({_id: boardId});

	var header = displayName  + " Đã thêm danh sách " + title + " vào bảng " + board.title;
	var history = new Recent({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: ""
	});
	history.save()
}
