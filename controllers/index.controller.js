var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var User_Group = require('../models/user_group.model');
var Recent = require("../models/recent.model");
var History = require("../models/history.model");
var Task = require("../models/task.model");
var Index = require("../models/index.model");
var Card = require("../models/card.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.create = async (req, res)=>{
	var content = req.body.content;
	var userId = req.signedCookies.userId;
	var taskId = req.body.taskId;

	var index = new Index({
		content: content,
		deadlineTime: 0,
		membersCount: 0,
		status: 0,
		taskId: taskId
	})


	var displayName = res.locals.user.displayName;
	var task = await Task.findOne({_id: taskId});
	var card = await Card.findOne({_id: task.cardId});
	var list = await List.findOne({_id: card.listId})

	var header = displayName  + " đã thêm chỉ mục \"" + title + "\"  vào công việc \"" + task.title + "\" của thẻ \"" + card.title + "\"  trong danh sách \"" + list.title + "\"";

	try {
		await index.save();
		res.send({index: index, header: header});
	}
	catch (e) {
		res.send("Create task failed " + e.toString());
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


module.exports.rename = async (req, res)=>{
	var title = req.body.title;
	var userId = req.signedCookies.userId;
	var indexId = req.body.indexId;

	var index = await Index.updateOne({_id: indexId}, {$set: {title: title}});
	
	var displayName = res.locals.user.displayName;
	var task = await Task.findOne({_id: index.taskId});
	var card = await Card.findOne({_id: task.cardId});
	var list = await List.findOne({_id: card.listId})

	var header = displayName  + " đã đổi tên 1 chỉ mục sang \"" + title + "\" trong thẻ \"" + card.title + "\" của danh sách \"" + list.title + "\"";

	try {
		res.send({index: index, header: header});
	}
	catch (e) {
		res.send("Rename index failed " + e.toString());
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
	var indexId = req.body.indexId;

	var index = await Index.remove({_id: indexId});

	var displayName = res.locals.user.displayName;
	var task = await Task.findOne({_id: index.taskId});
	var card = await Card.findOne({_id: task.cardId});
	var list = await List.findOne({_id: card.listId})

	var header = displayName  + " đã xóa chỉ mục \"" + title + "\" trong thẻ \"" + card.title + "\" của danh sách \"" + list.title + "\"";

	try {
		res.send({index: index, header: header});
	}
	catch (e) {
		res.send("Delete index failed " + e.toString());
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

module.exports.toggleStatus = async (req, res)=>{
	var userId = req.signedCookies.userId;
	var indexId = req.body.indexId;

	var index = await Index.findOne({_id: indexId});
	var index = await Index.updateOne({_id: indexId}, {$set: {status: (index.status + 1)%2}});
	
	var displayName = res.locals.user.displayName;
	var task = await Task.findOne({_id: index.taskId});
	var card = await Card.findOne({_id: task.cardId});
	var list = await List.findOne({_id: card.listId})

	var header = displayName  + " đã đổi trạng thái chỉ mục \"" + index.title + "\" sang " + (index.status == 1 ? "Hoàn Thành" : "Chưa Hoàn Thành") + " trong thẻ \"" + card.title + "\" của danh sách \"" + list.title + "\"";

	try {
		res.send({index: index, header: header});
	}
	catch (e) {
		res.send("Rename index failed " + e.toString());
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





