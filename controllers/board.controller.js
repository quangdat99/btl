var Board = require('../models/board.model');
var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");
var Card = require("../models/card.model");
var Comment = require('../models/comment.model');
var History = require('../models/history.model');
var Index = require('../models/index.model');
var Task = require('../models/task.model');

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");


module.exports.index = async function(req, res){
	var boardId = req.params.boardId;
	var userId = req.signedCookies.userId;

	var board = await Board.findOne({_id: boardId})
	var lists = await List.find({boardId: boardId});
	var group;
	if (board.groupId!== '#null'){
		group = await Group.findOne({_id: board.groupId});
	} else {
		group=0;
	}
	

	var _lists = [];
	for (var l in lists){
		var list = lists[l];
		var cards = await Card.find({listId: list._id});
		cards = JSON.parse(JSON.stringify(cards));
		for (var c in cards){
			
			var cardId = cards[c]._id;
			var tasks = await Task.find({cardId: cardId});
			taskIds = tasks.map((task)=>task._id);
			console.log(".. " + cardId);
			console.log("<< " + JSON.stringify(taskIds));
			var indexs = await Index.find({taskId: {$in: taskIds}});
			var completedIndexCount = indexs.filter((index)=>index.status == 1).length;

			var comments = await (await History.find({cardId: cardId}));
			var commentsCount = comments.filter((history)=>history.content != "").length;

			cards[c].completedIndexCount = completedIndexCount;
			cards[c].indexsCount = indexs.length;
			cards[c].commentsCount = commentsCount;

			console.log(">> " + JSON.stringify(indexs) + " :: " +indexs.length + " <> "+ completedIndexCount + " && "+ commentsCount)
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

	board.histories = _histories;
	res.render('board',{
		board: board,
		group: group
	});

	// console.log(board);
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

