const mongoose = require("mongoose");
var notificationSchema = new mongoose.Schema({
    content: String,
    timeCreated: Number,
    boardId: String,
    userId: String
})

var Notification = mongoose.model("Notification", notificationSchema, "notification");
module.exports = Notification;