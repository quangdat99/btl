var mongoose = require('mongoose');

var cardSchema = new mongoose.Schema({
	// listId: String,
	// _id: mongoose.Schema.Types.ObjectId,
	cardId: String,
	name: String,
	description: String,
	expirationDate: String,
	toDoNeed: String
});
var Card = mongoose.model('Card', cardSchema, 'card');

module.exports = Card;