const mongoose = require("mongoose");
var indexSchema = new mongoose.Schema({
    content: String,
    deadlineTime: Number,
    membersCount: Number,
    status: Number,
    taskId: String
})

var Index = mongoose.model("Index", indexSchema, "index");
module.exports = Index;