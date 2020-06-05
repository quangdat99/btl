const mongoose = require("mongoose");
var recentSchema = new mongoose.Schema({
    boardId: String,
    title: String,
    timeVisited: Number,
    userId: String,
    image: String
})

var Recent = mongoose.model("Recent", recentSchema, "recent");
module.exports = Recent;