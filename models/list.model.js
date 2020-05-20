var mongoose = require('mongoose');

var listSchema = new mongoose.Schema({
	// id: String,
	name: String
});
var List = mongoose.model('List', listSchema, 'list');

module.exports = List;