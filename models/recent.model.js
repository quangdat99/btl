const mongoose = require("mongoose");
var recentSchema = new mongoose.Schema({
    content: String,
    timeCreated: Number,
    count: Number,
    userId: String
})

var Recent = mongoose.model("Recent", recentSchema, "recent");
module.exports = Recent;