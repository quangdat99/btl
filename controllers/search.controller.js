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
	var users = await User.find({});
	users = filterUser(users, field);
	res.send({
		users: users
	})
};

module.exports.postSearchGroupUser = async function(req, res) {
	var field = req.body.field;
	var group = await Group.find({_id: req.signedCookies.userId});
	users = await User.find({groupId: group._id});
	users = filterUser(users, field);
	res.send({
		users: users
	})
};
