var express = require('express');
var controller = require('../controllers/index.controller');
var authMiddleware = require('../middlewares/auth.middleware');


var router = express.Router();


router.post('/create',authMiddleware.req, authMiddleware.requireLogin, controller.create);

router.post('/rename',authMiddleware.req, authMiddleware.requireLogin, controller.rename);

router.post('/delete',authMiddleware.req, authMiddleware.requireLogin, controller.delete);

router.post('/toggleStatus',authMiddleware.req, authMiddleware.requireLogin, controller.toggleStatus);

module.exports = router;
