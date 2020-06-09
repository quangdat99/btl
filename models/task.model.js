const mongoose = require("mongoose");
var taskSchema = new mongoose.Schema({
    title: String,
    completedIndexsCount: Number,
    indexsCount: Number,
    cardId: String,
    status: Number
})

var Task = mongoose.model("Task", taskSchema, "task");
module.exports = Task;