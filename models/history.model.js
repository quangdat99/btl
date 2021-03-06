var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
    // id: String,
    // _id: mongoose.Schema.Types.ObjectId,
    header: String,
    content: String,
    timeCreated: Number,
    cardId: String,
    boardId: String,
    groupId: String,
    userId: String
});
var History = mongoose.model('History', historySchema, 'history');

module.exports = History;