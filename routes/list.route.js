var express = require('express');
var controller = require('../controllers/group.controller');
var authMiddleware = require('../middlewares/auth.middleware');


var router = express.Router();

router.get('/create/:title',authMiddleware.req, authMiddleware.requireLogin, controller.index);

module.exports = router;
