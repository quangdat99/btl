var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
	name: String,
	timeCreate: Number,
	type: Boolean,
	groupId: String,
	userId: String
});
var Board = mongoose.model('Board', boardSchema, 'board');

module.exports = Board;