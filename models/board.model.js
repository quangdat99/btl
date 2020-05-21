var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
	// userId: String,
	// _id: mongoose.Schema.Types.ObjectId,
	groupId: String,
	boardId: String,
	name: String
});
var Board = mongoose.model('Board', boardSchema, 'board');

module.exports = Board;