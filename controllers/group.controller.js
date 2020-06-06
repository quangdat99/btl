var User = require('../models/user.model');
var List = require('../models/list.model');
var Board = require('../models/board.model');
var Group = require('../models/group.model');
var User_Group = require('../models/user_group.model');
var Recent = require("../models/recent.model");
const {BOARD_TYPE, MAX_RECENT} = require("./const/Const");

module.exports.index = async function(req, res) {
	var groupId = req.params.groupId;

	var partners = await User_Group.find({groupId: groupId});

	var group = await Group.findOne({_id: groupId});

	var boards = await Board.find({boardType: BOARD_TYPE.SHARED, groupId: groupId});

	console.log(group);
	res.render('group',{
		group: group,
		boards: boards,
		memberCount: partners.length,
	});
};


module.exports.member = async function(req, res) {
	var groupId = req.params.groupId;
	var group = await Group.findOne({_id: groupId});

	var user_group = await User_Group.find({groupId: groupId});
	var userIds = user_group.map((u_g)=>u_g.userId);
	
	var members = await User.find({_id: {$in: userIds}});

	res.render('member',{
		members: members,
		group: group
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
		await group.save();

		var user_group = new User_Group({
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

module.exports.addMember = async(req, res)=>{
	var groupId = req.body.groupId;
	var userId = req.body.userId;

	var user = await User.findOne({_id: userId});

	var user_group = new User_Group({
		userId: userId,
		groupId: groupId
	})

	try {
		await user_group.save();
		res.json(user);
	}
	catch (e){
		res.send("Add user Faild " + e.toString());
	}

}
