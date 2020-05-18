var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
	userId: String,
	groupId: String,
	name: String
});
var Group = mongoose.model('Group', groupSchema, 'group');

module.exports = Group;