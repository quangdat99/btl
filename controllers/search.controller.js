var User = require('../models/user.model');
var Group = require('../models/group.model');
var User_Group = require("../models/user_group.model");


const filterUser = (users, field)=>{
	var reg = new RegExp(field, "gi")
	return users.filter((user)=>{
		return (user.email.search(reg) != -1 || user.displayName.search(reg) != -1);
	});
}

// tìm user không trong nhóm này để thêm vào nhóm group
// tìm partners =>> trả về những ai không phải parter
module.exports.postSearchAllUser = async function(req, res) {
	var field = req.body.field;
	var groupId = req.body.groupId;

	var userId = req.signedCookies.userId;
	// var userId = req.body.userId;

	if (groupId == "#null"){
		var users = await User.find({_id: {$not: userId}});
	}
	else {
		var partnersGroup = await User_Group.find({groupId: groupId});
		partnerIds = partnersGroup.map((partnerGroup)=>{
			return partnerGroup.userId;
		});
		
		var users = await User.find({_id: {$nin: partnerIds}});
		users = users.map((user)=>{
			return {
				_id: user._id,
				displayName: user.displayName,
				email: user.email
			}
		})
	}
	
	if (field != "#null")
		users = filterUser(users, field);
	res.send({
		users: users
	})
};

// tìm user trong group để chỉ định công việc
module.exports.postSearchGroupUser = async function(req, res) {
	var field = req.body.field;
	var groupId = req.body.groupId;

	var userId = req.signedCookies.userId;
	// var userId = req.body.userId;

	if (groupId == "#null"){
		var users = await User.find({_id: {$not: userId}});
	}
	else {
		var partnersGroup = await User_Group.find({groupId: groupId, userId: {$ne: userId}});
		partnerIds = partnersGroup.map((partnerGroup)=>{
			return partnerGroup.userId;
		});
		
		var users = await User.find({_id: {$in: partnerIds}});
		users = users.map((user)=>{
			return {
				_id: user._id,
				displayName: user.displayName,
				email: user.email
			}
		})
	}
	
	if (field != "#null")
		users = filterUser(users, field);
	res.send({
		users: users
	})
};
