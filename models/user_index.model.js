const mongoose = require("mongoose");
var user_indexSchema = new mongoose.Schema({
    userId: String,
    indexId: String
})

var User_index = mongoose.model("User_Index", user_indexSchema, "user_index");
module.exports = User_index;