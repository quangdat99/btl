var express = require('express');
var controller = require('../controllers/task.controller');
var authMiddleware = require('../middlewares/auth.middleware');


var router = express.Router();


router.post('/create',authMiddleware.req, authMiddleware.requireLogin, controller.create);

router.post('/rename',authMiddleware.req, authMiddleware.requireLogin, controller.rename);

router.post('/delete',authMiddleware.req, authMiddleware.requireLogin, controller.delete);

router.post('/toggleStatus',authMiddleware.req, authMiddleware.requireLogin, controller.toggleStatus);

router.post('/appoint',authMiddleware.req, authMiddleware.requireLogin, controller.appoint);

router.post('/setDeadlineTime',authMiddleware.req, authMiddleware.requireLogin, controller.setDeadlineTime);

module.exports = router;
