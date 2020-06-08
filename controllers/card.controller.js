var User = require('../models/user.model');
var List = require('../models/list.model');
var Card = require('../models/card.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var User_Group = require('../models/user_group.model');
var Recent = require("../models/recent.model");
var History = require("../models/history.model");
var Task = require("../models/task.model");
var Index = require("../models/index.model");
var User_Index = require("../models/user_index.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.index = async (req, res)=>{
	var cardId = req.body.cardId;
	var card = await Card.findOne({_id: cardId});
	card = JSON.parse(JSON.stringify(card))
	var histories = await History.find({cardId: cardId});
	card.histories = JSON.parse(JSON.stringify(histories));

	var tasks = await Task.find({cardId: cardId});
	for (var t in tasks){
		var taskId = tasks[t]._id;
		var indexs = await Index.find({taskId: taskId});
		indexs = indexs.map(async (index)=>{
			var user_indexs = await User_Index.find({indexId: index._id});
			var userIds = user_indexs.map((user_index)=>{
				return user_index.userId;
			});
			var users = await User.find({_id: {$in: userIds}});
			return {
				_id: index._id,
				content: index.content,
				deadlineTime: index.deadlineTime,
				membersCount: index.membersCount,
				status: index.status,
				taskId: index.taskId,
				users: users
			}
		});
		// var completedIndexsCount = indexs.filter((index)=>index.status == 1);
		tasks[t].indexs = indexs;
		// tasks[t].completedIndexsCount = completedIndexsCount;
		// tasks[t].indexsCount = indexs.length - completedIndexsCount;
	}
	card.tasks = JSON.parse(JSON.stringify(tasks));
	res.json({card: card});
}

module.exports.create = async (req, res)=>{
	var userId = req.signedCookies.userId;
	var title = req.body.title;
	var listId = req.body.listId;
	var boardId = req.body.boardId;

	var card = new Card({
		title: title,
		description: '',
		deadlineTime: -1,
		listId: listId
	});

	try {
		await card.save();
		res.redirect("/board/" + boardId);
	}
	catch (e) {
		res.send("Create card failed " + e.toString());
	};
	var user = await User.findOne({_id: req.signedCookies.userId });


	var displayName = res.locals.user.displayName;
	var list = await List.findOne({_id: listId});
	var board = await Board.findOne({_id: list.boardId});

	var header = displayName  + " Đã thêm 1 thẻ \"" + title + "\" vào danh sách \"" + list.title + "\"";
	var history = new History({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: cardId,
		boardId: board._id
	});
	try {
		history.save()
	}
	catch (e){
		res.send("Create card failed! " + e.toString());
	}

	global.socket.emit("NEW_HISTORY", {
		userId: userId, 
		history: history
	});
	
};


module.exports.rename = async (req, res)=>{
	var title = req.body.title;
	var userId = req.signedCookies.userId;
	var cardId = req.body.cardId;
	var displayName = res.locals.user.displayName;

	try {
		await Card.updateOne({_id: cardId}, {$set: {title: title}});
		res.send({result: "success"});
	}
	catch (e){
		res.send("Rename card failed! " + e.toString());
	};

	var card = await Card.findOne({_id: cardId});
	var list = await List.findOne({_id: card.listId});
	var board = await Board.findOne({_id: list.boardId});

	var header = displayName  + " Đã đã đổi tên 1 thẻ sang \"" + title + "\" trong danh sách \"" + list.title + "\"";
	var history = new History({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: cardId,
		boardId: board._id
	});
	history.save()
	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history
	})
};

module.exports.updateDescription = async (req, res, next) => {
	var description = req.body.description;
	var cardId = req.body.cardId;
	var displayName = res.locals.user.displayName;

	try {
		await Card.updateOne({_id: cardId}, {$set: {description: description}});
		res.send({result: "success"});
	}
	catch (e) {
		res.send("update description failed !");
	};

	var card = await Card.findOne({_id: cardId});
	var list = await List.findOne({_id: card.listId});
	var board = await Board.findOne({_id: list.boardId});

	var header = displayName + " đã đổi mô tả của thẻ \"" + card.title + "\"sang \"" + description + "\" trong danh sách \"" + list.title + "\"";
	var history = new History({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: cardId,
		boardId: board._id
	});
	history.save()
	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history
	})
}




