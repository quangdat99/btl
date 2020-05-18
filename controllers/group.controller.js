var Board = require('../models/board.model');
var List = require('../models/list.model');


module.exports.index = async function(req, res) {
	var boards = await Board.find();
	res.render('group',{
		
	});
};
