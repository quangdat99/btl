var express = require('express');
var controller = require('../controllers/board.controller');


var router = express.Router();

router.get('/', controller.index);
router.get('/list',controller.list);


module.exports = router;