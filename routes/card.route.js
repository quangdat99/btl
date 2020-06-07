var express = require('express');
var controller = require('../controllers/card.controller');
var authMiddleware = require('../middlewares/auth.middleware');


var router = express.Router();

router.post('/index', authMiddleware.req, authMiddleware.requireLogin, controller.index)

router.post('/create',authMiddleware.req, authMiddleware.requireLogin, controller.create);

router.post('/rename',authMiddleware.req, authMiddleware.requireLogin, controller.rename);

router.post('/updateDescription',authMiddleware.req, authMiddleware.requireLogin, controller.updateDescription);

module.exports = router;
