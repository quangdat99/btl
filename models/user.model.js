var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	// userId: String,
	email: String,
	name: String,
	account: String,
	password: String,
	profile: String
});
var User = mongoose.model('User', userSchema, 'user');

module.exports = User;