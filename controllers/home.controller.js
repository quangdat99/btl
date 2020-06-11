var Card = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");
var User_Group = require("../models/user_group.model");
var History = require("../models/history.model");
var Task = require("../models/task.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");


module.exports.index = async function(req, res){
	var userId = req.signedCookies.userId;

	// private board
	var privateBoards = await Board.find({boardType: BOARD_TYPE.PRIVATE, userId: userId});
	var privateBoardsId = privateBoards.map((board)=>{
		return board._id;
	});
	privateBoards = JSON.parse(JSON.stringify(privateBoards));
	for (var b in privateBoards){
		var nextDeadline = await getNextDeadlineTime(privateBoards[b]._id, userId);
		privateBoards[b].nextDeadline = nextDeadline;
	}

	// group & shared-board
	var user_groups = await User_Group.find({userId: userId});
	var groupIds = user_groups.map((user_group)=>{
		return user_group.groupId;
	})
	var groups = await Group.find({_id: {$in: groupIds}});
	groups = JSON.parse(JSON.stringify(groups));

	var sharedBoardsId = [];

	for (var g in groups){
		var group = groups[g];
		var boards = await Board.find({boardType: BOARD_TYPE.SHARED, groupId: group._id});
		var sharedIds = boards.map((board)=>board._id);
		sharedBoardsId = sharedBoardsId.concat(sharedIds);

		boards = JSON.parse(JSON.stringify(boards));
		for (var b in boards){
			var nextDeadline = await getNextDeadlineTime(boards[b]._id, userId);
			boards[b].nextDeadline = nextDeadline;
		}

		group.boards = boards;
	}

	// history
	var boardIds = privateBoardsId.concat(sharedBoardsId);
	var histories = await History.find({boardId: {$in: boardIds}});
	
	histories = histories.map((history)=>{
		return {
			_id: history._id,
			header: history.header,
			content: history.content,
			timeCreated: history.timeCreated,
			cardId: history.cardId,
			boardId: history.boardId
		}
	})

	histories = histories.sort((h0, h1)=>{
		return h1.timeCreated - h0.timeCreated
	});

	
	// recent board
	var recents = await Recent.find({userId: userId});
	recents.sort((r0, r1)=>{
		return r1.timeVisited - r0.timeVisited
	});
	var slicer = Math.min(recents.length, MAX_RECENT);
	recents = recents.slice(0, slicer);

	res.render('home',{
		privateBoards: privateBoards,
		recents:recents,
		groups:groups,
		histories: histories
	});
};



const getNextDeadlineTime = async (boardId, userId)=>{
	var lists = await List.find({boardId: boardId});
	var listsId = lists.map((list)=>list._id);
	var cards = await Card.find({listId: {$in: listsId}});
	var cardsId = cards.map((card)=>card._id);

	var tasks = await Task.find({cardId: {$in: cardsId}});

	var nextDeadline = Number.MAX_SAFE_INTEGER
	var taskTitle = '';

	tasks.forEach((task)=>{
		if (task.deadlineTime != -1 && task.userId == userId){
			nextDeadline = Math.min(task.deadlineTime, nextDeadline)
		};
	});

	if (nextDeadline == Number.MAX_SAFE_INTEGER) 
		return {
			taskTitle: taskTitle,
			time: -1
		}
	return {
		taskTitle: taskTitle,
		time: nextDeadline
	}
}