const mongoose = require("mongoose");
var taskSchema = new mongoose.Schema({
    content: String,
    status: Number,
    cardId: String
})

var Task = mongoose.model("Task", taskSchema, "task");
module.exports = Task;