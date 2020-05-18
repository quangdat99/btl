var Board = require('../models/board.model');
var List = require('../models/list.model');


module.exports.index = async function(req, res) {
	var boards = await Board.find();
	res.render('board',{
		boards: boards
	});
};

module.exports.list = async function(req, res) {
	var lists = await List.find();
	res.render('list',{
		lists: lists
	});
};
