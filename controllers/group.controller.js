var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var USer_Group = require('../models/user_group.model');
var Recent = require("../models/recent.model");
const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.index = async function(req, res) {
	var groupId = req.params.groupId;

	var partners = await User.find({groupId: groupId});

	var group = await Group.findOne({_id: groupId});

	var boards = await Board.find({boardType: BOARD_TYPE.SHARED, groupId: groupId});


	// boards = JSON.stringify(boards);

	res.render('group',{
		_id: group._id,
		title: group.title,
		description: group.description,
		boards: boards,
		memberCount: partners.length,
	});
};


module.exports.member = async function(req, res) {
	var groupId = req.params.groupId;

	var groupId = req.params.groupId;
	var partners = await User.find({groupId: groupId});

	res.render('member',{
		members: partners	,
		groupId: groupId
	});
};


module.exports.create = async (req, res)=>{
	var title = req.body.title;
	var description = req.body.description;
	var memberCount = 0;

	var userId = req.signedCookies.userId;

	var group = new Group({
		title: title,
		description: description,
		memberCount: memberCount
	})

	try {
		group.save();

		var user_group = new USer_Group({
			userId: userId,
			groupId: group._id
		});
		await user_group.save();

		res.redirect("/home");
	}
	catch (e){
		console.log(e)
	}
}
