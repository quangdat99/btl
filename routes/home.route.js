var express = require('express');
var controller = require('../controllers/home.controller');
var authMiddleware = require('../middlewares/auth.middleware');


var router = express.Router();

router.get('/',authMiddleware.req, authMiddleware.requireLogin, controller.index);

module.exports = router;