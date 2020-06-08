var express = require('express');
var controller = require('../controllers/comment.controller');
var authMiddleware = require('../middlewares/auth.middleware');


var router = express.Router();


router.post('/create',authMiddleware.req, authMiddleware.requireLogin, controller.create);

module.exports = router;
