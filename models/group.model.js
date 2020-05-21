var mongoose = require('mongoose');

var groupSchema = new mongoose.Schema({
	// userId: String,
	// _id: mongoose.Schema.Types.ObjectId,
	// groupId: String,
	title: String,
	description: String,
	memberCount: Number
});
var Group = mongoose.model('Group', groupSchema, 'group');

module.exports = Group;