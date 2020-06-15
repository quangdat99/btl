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

module.exports.remove = async(req, res)=>{
	var groupId = req.body.groupId;
	var userId = req.signedCookies.userId;

	await User_Group.remove({userId: userId, groupId: groupId});
	res.redirect("/home")
}

module.exports.search = async(req, res)=>{
	var userId = req.signedCookies.userId;
	// var userId = req.body.userId;
	var field = req.body.field;
	var groups = [];
	if (field == "")
		res.send({groups: groups});
	var user_group = await User_Group.find({userId: userId});
	var groupsId = user_group.map((ug)=>ug.groupId);
	var reg = new RegExp(field, "gi");
	var groups = await Group.find({title: reg, _id: {$nin: groupsId}});
	res.send({groups: groups});
}

module.exports.join = async(req, res)=>{
	var userId = req.signedCookies.userId;
	var groupId = req.body.groupId;
	var user = res.locals.user;

	var group = await Group.findOne({_id: groupId});
	var header = user.displayName + " yêu cầu tham gia nhóm " + group.title;
	var content = "Nhấn vào đây để chấp nhận";
	var timeCreated = new Date().getTime();

	var history = new History({
		header: header,
		content: console,
		timeCreated: time,
		cardId: "",
		boardId: "",
		groupId: groupId
	});

	await history.save();

	global.socket.emit("NEW_HISTORY", {
		userId: userId, 
		history: history
	});
}

module.exports.accept = async(req, res)=>{

}