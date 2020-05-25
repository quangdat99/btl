var User = require('../models/user.model');
var Group = require('../models/group.model');



const filterUser = (users, field)=>{
	var reg = new RegExp(field, "gi")
	return users.filter((user)=>{
		return (user.email.search(reg) != -1 || user.displayName.search(reg) != -1);
	});
}

module.exports.postSearchAllUser = async function(req, res) {
	var field = req.body.field;
	var userId = req.signedCookies.userId;
	var user = await User.find({_id: userId});

	var groupId = user.groupId;
	if (groupId == undefined || groupId == null){
		var users = await User.find({_id: {$ne: userId}});
	}
	else {
		var users = await User.find({groupId: {$ne: groupId}});
	}
	
	users = filterUser(users, field);
	res.send({
		users: users
	})
};

module.exports.postSearchGroupUser = async function(req, res) {
	var field = req.body.field;
	var userId = req.signedCookies.userId;
	var user = await User.findOne({_id: userId});

	var group = await Group.findOne({_id: user.groupId});
	users = await User.find({groupId: group._id, _id: {$ne: userId}});
	users = filterUser(users, field);
	res.send({
		users: users
	})
};
