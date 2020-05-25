var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var Recent = require("../models/recent.model");
const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.index = async function(req, res) {
	var boards = await Board.find();
	res.render('group',{
		
	});
};


module.exports.member = async function(req, res) {
	var user = await User.find();
	res.render('member',{
		
	});
};


module.exports.create = async (req, res)=>{
	var title = req.body.title;
	var description = req.body.description;
	var memberCount = 0;

	var group = new Group({
		title: title,
		description: description,
		memberCount: memberCount
	})

	try {
		await group.save();
		var user = await User.findOne({_id: req.signedCookies.userId});
		// private board
		var privateBoards = await Board.find({boardType: BOARD_TYPE.PRIVATE, userId: user._id});
		// group & shared-board
		var groups = await Group.find({_id: user.groupId});
		var sharedBoards = [];
		for (var g in groups){
			var group = groups[g];
			var groupBoard = await Board.find({boardType: BOARD_TYPE.SHARED, groupId: group._id});
			var sBoard = {
				groupId: group._id,
				boards: JSON.parse(JSON.stringify(groupBoard))
			};
			sharedBoards.push(sBoard);
		}
		var recents = await Recent.find({userId: user._id});
		recents.sort((r0, r1)=>{
			return r1.timeVisited - r0.timeVisited
		});
		var slicer = Math.min(recents.length, MAX_RECENT);
		recents = recents.slice(0, slicer);

		// render
		res.render("home", {
			err: "none",
			value: {
				privateBoards: privateBoards,
				sharedBoards: sharedBoards,
				groups: groups,
				recents: recents,
			},
		});
	}
	catch (e){
		console.log(e)
	}
}
