var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
	// listId: String,
	// _id: mongoose.Schema.Types.ObjectId,
	title: String,
	description: String,
	deadlineTime: String,
	listId: String
});
var Card = mongoose.model('Card', cardSchema, 'card');

module.exports = Card;