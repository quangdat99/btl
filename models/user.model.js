var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	// userId: String,
	// _id: mongoose.Schema.Types.ObjectId,
	email: String,
	displayName: String,
	password: String,
	groupId: String
});
var User = mongoose.model('User', userSchema, 'user');

module.exports = User;