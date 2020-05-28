var express = require('express');
var controller = require('../controllers/board.controller');


var router = express.Router();

router.get('/', controller.index);
router.get('/list',controller.list);
router.post('/create', controller.create);


module.exports = router;