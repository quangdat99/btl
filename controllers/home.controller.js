var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");
var User_Group = require("../models/user_group.model");

const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");


module.exports.index = async function(req, res){
	var userId = req.signedCookies.userId;

	// private board
	var privateBoards = await Board.find({boardType: BOARD_TYPE.PRIVATE, userId: userId});
	
	// group & shared-board
	var user_groups = await User_Group.find({userId: userId});
	var groupIds = user_groups.map((user_group)=>{
		return user_group.groupId;
	})
	var groups = await Group.find({_id: {$in: groupIds}});
	groups = groups.map((group)=>{
		return {
			_id: group._id,
			title: group.title,
			description: group.description,
			memberCount: group.memberCount
		}
	});

	for (var g in groups){
		var group = groups[g];
		var boards = await Board.find({boardType: BOARD_TYPE.SHARED, groupId: group._id});
		boards = boards.map((board)=>{
			return {
				_id: board._id,
				title: board.title,
				timeCreated: board.timeCreated
			}
		});
		group.boards = JSON.parse(JSON.stringify(boards));
	}

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
		groups:groups
	});

}