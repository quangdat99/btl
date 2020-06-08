var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var User_Group = require('../models/user_group.model');
var Recent = require("../models/recent.model");
var History = require("../models/history.model");
var Task = require("../models/task.model");
var Card = require("../models/card.model");
var Index = require("../models/index.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.create = async (req, res)=>{
	var content = req.body.content;
	var userId = req.signedCookies.userId;
	var cardId = req.body.cardId;
	console.log(req.body);
	var displayName = res.locals.user.displayName;
	var card = await Card.findOne({_id: cardId});
	var list = await List.findOne({_id: card.listId})
	var header = displayName  + " đã bình luận trong thẻ \"" + card.title + "\" của danh sách \"" + list.title + "\"";

	var history = new History({
		header: header,
		content: content,
		timeCreated: new Date().getTime(),
		cardId: cardId,
		boardId: list.boardId
	});
	try {
		history.save()
		
	}
	catch (e){
		console.log("save history failed " + e.toString());
	}
	
	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history
	})
};
