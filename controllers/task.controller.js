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
	var title = req.body.title;
	var userId = req.signedCookies.userId;
	var cardId = req.body.cardId;
	console.log(req.body);
	var task = new Task({
		title: title,
		completedIndexsCount: 0,
		indexsCount: 0,
		cardId: cardId
	})


	var displayName = res.locals.user.displayName;
	var card = await Card.findOne({_id: cardId});
	var list = await List.findOne({_id: card.listId})
console.log(card);
	var header = displayName  + " đã thêm công việc \"" + title + "\" vào thẻ \"" + card.title + "\" của danh sách \"" + list.title + "\"";

	try {
		await task.save();
		res.json({task: task, header: header});
	}
	catch (e) {
		res.send("Create task failed " + e.toString());
	};

	var history = new History({
		header: header,
		content: "",
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
	
};


module.exports.rename = async (req, res)=>{
	var title = req.body.title;
	var userId = req.signedCookies.userId;
	var taskId = req.body.taskId;

	console.log("rename task " + title + " :: " + taskId);
	var task = await Task.updateOne({_id: taskId}, {$set: {title: title}});
	
	var displayName = res.locals.user.displayName;
	var task = await Task.findOne({_id: taskId});
	var card = await Card.findOne({_id: task.cardId});
	var list = await List.findOne({_id: card.listId})

	var header = displayName  + " đã đổi tên 1 công việc sang \"" + title + "\" trong thẻ \"" + card.title + "\" của danh sách \"" + list.title + "\"";

	try {
		res.send({task: task, header: header});
	}
	catch (e) {
		res.send("Rename task failed " + e.toString());
	};

	var history = new History({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: task.cardId,
		boardId: list.boardId
	});
	try {
		history.save()
	}
	catch (e){
		console.log("save history failed " + e.toString());
	}
};

module.exports.delete = async (req, res)=>{
	var title = req.body.title;
	var userId = req.signedCookies.userId;
	var taskId = req.body.taskId;

	

	var displayName = res.locals.user.displayName;
	var task = await Task.findOne({_id: taskId});
	var card = await Card.findOne({_id: task.cardId});
	var list = await List.findOne({_id: card.listId})

	var header = displayName  + " đã xóa công việc \"" + title + "\" trong thẻ \"" + card.title + "\" của danh sách \"" + list.title + "\"";

	

	var history = new History({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: task.cardId,
		boardId: list.boardId
	});
	try {
		history.save()
	}
	catch (e){
		console.log("save history failed " + e.toString());
	}

	try {
		await Task.deleteOne({_id: taskId});
		res.send({task: task, header: header});
	}
	catch (e) {
		res.send("Rename task failed " + e.toString());
	};
};



