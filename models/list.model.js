var mongoose = require('mongoose');

var listSchema = new mongoose.Schema({
	// id: String,
	// _id: mongoose.Schema.Types.ObjectId,
	title: String,
	cardsCount: Number,
	boardId: String
});
var List = mongoose.model('List', listSchema, 'list');

module.exports = List;