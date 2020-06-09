const mongoose = require("mongoose");
var user_taskSchema = new mongoose.Schema({
    userId: String,
    taskId: String
})

var User_Task = mongoose.model("User_Task", user_taskSchema, "user_task");
module.exports = User_Task;