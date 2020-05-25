var express = require('express');
var controller = require('../controllers/group.controller');


var router = express.Router();

router.get('/', controller.index);

router.get("/create", controller.create);

module.exports = router;