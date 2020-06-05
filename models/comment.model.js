var mongoose = require('mongoose');

var commentSchemas = new mongoose.Schema({
    content: String,
    userName: String,
    timeCreated: Number,
    cardId: String
});
var Comment = mongoose.model('Comment', commentSchemas, 'comment');

module.exports = Comment;