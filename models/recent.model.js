const mongoose = require("mongoose");
var recentSchema = new mongoose.Schema({
    boardId: String,
    boardTitle: String,
    timeVisited: Number,
    userId: String
})

var Recent = mongoose.model("Recent", recentSchema, "recent");
module.exports = Recent;