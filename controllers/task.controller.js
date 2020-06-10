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
var User_Task = require("../models/user_task.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.create = async (req, res)=>{
	var title = req.body.title;
	var userId = req.signedCookies.userId;
	var cardId = req.body.cardId;
	var task = new Task({
		title: title,
		completedIndexsCount: 0,
		indexsCount: 0,
		cardId: cardId,
		status: 0,
		deadlineTime: -1,
		userId: -1
	})


	var displayName = res.locals.user.displayName;
	var card = await Card.findOne({_id: cardId});
	var list = await List.findOne({_id: card.listId})
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
	
	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history
	})
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
	};

	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history
	})
};

module.exports.delete = async (req, res)=>{
	var title = req.body.taskTitle;
	var userId = req.signedCookies.userId;
	var taskId = req.body.taskId;

	
	console.log(req.body);
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

	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history,
	})

};


module.exports.toggleStatus = async (req, res)=>{
	var userId = req.signedCookies.userId;
	var taskId = req.body.taskId;

	console.log(task);

	var task = await Task.findOne({_id: taskId});
	await Task.updateOne({_id: taskId}, {$set: {status: (task.status + 1)%2}});

	var displayName = res.locals.user.displayName;
	var card = await Card.findOne({_id: task.cardId});
	var list = await List.findOne({_id: card.listId})

	var header = displayName  + " đã đổi trạng thái công việc \"" + task.title + "\" sang " + (task.status == 0 ? "Hoàn Thành" : "Chưa Hoàn Thành") + " trong thẻ \"" + card.title + "\" của danh sách \"" + list.title + "\"";

	try {
		res.send({task: task, header: header});
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
		await history.save()
	}
	catch (e){
		console.log("save history failed " + e.toString());
	};

	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history,
	})
};

module.exports.appoint = async (req, res) => {
	var taskId = req.body.taskId;
	var userId = req.signedCookies.userId;
	var appointedUserId = req.body.appointedUserId;

	var user_task = new User_Task({
		userId: appointedUserId,
		taskId: taskId
	})

	var appointedUser = await User.findOne({_id: appointedUserId});

	try {
		await user_task.save();
		res.send(appointedUser);
	}
	catch (e) {
		res.send("Bổ nhiệm không thành công " + e.toString());
	}
	
	var task = await Task.findOne({_id: taskId});
	await Task.updateOne({_id: taskId}, {$set: {userId: appointedUserId}});

	var displayName = res.locals.user.displayName;
	var appointedUserName = appointedUser.displayName;

	var card = await Card.findOne({_id: task.cardId});
	var list = await List.findOne({_id: card.listId})

	var header = displayName  + " đã chỉ định công việc \"" + task.title + "\" cho \"" + appointedUserName + "\" trong thẻ \"" + card.title + "\"";

	var history = new History({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: task.cardId,
		boardId: list.boardId
	});
	try {
		await history.save()
	}
	catch (e){
		console.log("save history failed " + e.toString());
	};

	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history,
	})
};

module.exports.setDeadlineTime = async (req, res)=>{
	var userId = req.signedCookies.userId;
	var taskId = req.body.taskId;
	var deadlineTime = req.body.deadlineTime;
		deadlineTime = Number(deadlineTime);
		console.log(req.body);
	var task = await Task.findOne({_id: taskId});
				await Task.updateOne({_id: taskId}, {$set: {deadlineTime: deadlineTime}});
	console.log(task);
	var displayName = res.locals.user.displayName;
	var card = await Card.findOne({_id: task.cardId});
	var list = await List.findOne({_id: card.listId})

	var header = displayName  + " đã cập nhật ngày hết hạn công việc \"" + task.title + "\" trong thẻ \"" + card.title + "\" của danh sách \"" + list.title + "\"";

	try {
		res.send({task: task, header: header});
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
		await history.save()
	}
	catch (e){
		console.log("save history failed " + e.toString());
	};

	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history,
	})
};









