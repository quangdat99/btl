const mongoose = require("mongoose");
var user_groupSchema = new mongoose.Schema({
    userId: String,
    groupId: String
})

var User_Group = mongoose.model("User_Group", user_groupSchema, "user_group");
module.exports = User_Group;