var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
    // id: String,
    // _id: mongoose.Schema.Types.ObjectId,
    content: String,
    timeCreated: Number,
    cardId: String
});
var History = mongoose.model('History', listSchema, 'history');

module.exports = History;