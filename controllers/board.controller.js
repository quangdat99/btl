var Board = require('../models/board.model');
var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");
var Card = require("../models/card.model");
var Comment = require('../models/comment.model');
var History = require('../models/history.model');
var User_Group = require('../models/user_group.model');
var Task = require('../models/task.model');

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");


module.exports.index = async function(req, res){
	var boardId = req.params.boardId;
	var userId = req.signedCookies.userId;

	var board = await Board.findOne({_id: boardId})
	var lists = await List.find({boardId: boardId});
	var group;
	if (board.boardType == BOARD_TYPE.SHARED){
		group = await Group.findOne({_id: board.groupId});
		var user_group = await User_Group.find({groupId: board.groupId});
		var usersId = user_group.map((ug)=>ug.userId);
		var users = await User.find({_id: {$in: usersId}});
	} else {
		group=0;
		var users = [res.locals.user];
	};


	var taskDistribution = {};
	var taskComplement = {};
	var taskOverDeadline = {};
	var userDisplayName = {};

	for (var u in users){
		var uId = users[u]._id;
		taskDistribution[uId] = 0;
		taskComplement[uId] = 0;
		taskOverDeadline[uId] = 0;
		userDisplayName[uId] = users[u].displayName;
	}

	var _lists = [];
	for (var l in lists){
		var list = lists[l];
		var cards = await Card.find({listId: list._id});
		cards = JSON.parse(JSON.stringify(cards));
		for (var c in cards){
			var cardId = cards[c]._id;
			var tasks = await Task.find({cardId: cardId});
			var completedTasks = tasks.filter((t)=>(t.status == 1));
			var histories = await History.find({cardId: cardId});
			var comments = histories.filter((h)=>(h.content != ""));
			
			cards[c].commentsCount = comments.length;
			cards[c].completedTasksCount = completedTasks.length;
			cards[c].tasksCount = tasks.length;

			var tasks = await Task.find({cardId: cardId});
			for (var t in tasks){
				var task = tasks[t];
				var userId = task.userId;
				if (!isNaN(taskDistribution[userId])){
					taskDistribution[userId] ++;
					var completed = task.status == 1 && task.deadlineTime <= new Date().getTime();
					if (completed) {
						taskComplement[userId] ++;
					var overDeadline = task.status == 0 && task.deadlineTime >= new Date().getTime();
					if (overDeadline)
						taskOverDeadline[userId] ++;
					}
				}
			}
		}

		_lists.push({
			_id: list._id,
			title: list.title,
			cardCount: cards.length,
			cards: cards,
		});
	}

	var _histories = await History.find({boardId: boardId});
	_histories = JSON.parse(JSON.stringify(_histories));

	board = JSON.parse(JSON.stringify(board));
	board.lists = _lists;

	// console.log(histories);

	res.render('board',{
		board: board,
		group: group,
		taskDistribution: taskDistribution,
		taskComplement: taskComplement,
		taskOverDeadline: taskOverDeadline,
		userDisplayName: userDisplayName,
		histories: _histories
	});

	var recents = await Recent.find({userId: userId});
	if (recents.filter((recent)=>{
		return (recent.userId == userId && recent.boardId == boardId)
	}).length !=0 ){
		await Recent.updateOne(
			{ userId: userId, boardId: boardId },
			{ $set: { timeVisited : new Date().getTime() } }
		);	
	}
	else {
		recents.sort((r0, r1)=>(r1.timeVisited-r0.timeVisited));
		if (recents.length > 5) {
			var recentOut = recents[0];
			await Recent.updateOne(
				{ userId: recentOut.userId, boardId: recentOut.boardId },
				{ $set: { timeVisited : new Date().getTime(), userId: userId, boardId: boardId } }
			);	
		}
		else {
			var recent = new Recent({
				boardId: boardId,
				title: board.title,
				timeVisited: new Date().getTime(),
				userId: req.signedCookies.userId,
				image: board.image
			});
			recent.save();
		}
	}
}
module.exports.create = async (req, res)=>{
	var userId = req.signedCookies.userId;
	var title = req.body.title;
	var timeCreated = new Date().getTime();
	var groupId = req.body.groupId;

	var image = "/image/bg/"+(Math.floor(Math.random() *13)+1) +".jpg";

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

	try {
		board.save();
		res.redirect("/home");
	}
	catch (e){	
		console.log("save board failed " + e.toString());
	};

	if (boardType == BOARD_TYPE.SHARED){
		var displayName = res.locals.user.displayName;
		var group = await Group.findOne({_id: groupId});

		var header = displayName  + " Đã tạo bảng \"" + title + "\" với nhóm \"" + group.title + "\"";
		var history = new History({
			header: header,
			content: "",
			timeCreated: new Date().getTime(),
			cardId: "",
			boardId: board._id
		});
		history.save();

		global.socket.emit("NEW_HISTORY", {
			userId: userId,
			history: history
		})
	}
};

module.exports.changeBackground = async (req, res) =>{
	var userId = req.signedCookies.userId;
	var imgUrl = req.body.imgUrl;
	var timeCreated = new Date().getTime();
	var boardId = req.body.boardId;

	try {
		await Board.updateOne({_id: boardId}, {$set: {image: imgUrl}});
		await Recent.updateOne({boardId: boardId}, {$set: {image: imgUrl}});
		res.send({result: "success"});
	}
	catch (e) {
		res.send("update background failed !");
	};

	var displayName = res.locals.user.displayName;
	var board = await Board.findOne({_id: boardId});

	var header = displayName + " đã đổi Background trong bảng \"" + board.title + "\"";
	var history = new History({
		header: header,
		content: "",
		timeCreated: new Date().getTime(),
		cardId: "",
		boardId: boardId
	});
	history.save()
	global.socket.emit("NEW_HISTORY", {
		userId: userId,
		history: history
	})
}

