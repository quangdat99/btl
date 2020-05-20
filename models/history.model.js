var mongoose = require('mongoose');

var historySchema = new mongoose.Schema({
    // id: String,
    content: String
});
var History = mongoose.model('History', listSchema, 'history');

module.exports = History;