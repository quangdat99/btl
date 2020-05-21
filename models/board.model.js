var mongoose = require('mongoose');

var boardSchema = new mongoose.Schema({
	title: String,
	timeCreated: Number,
	boardType: String,
	groupId: String,
	userId: String
});
var Board = mongoose.model('Board', boardSchema, 'board');

module.exports = Board;