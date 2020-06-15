var express = require('express');
var controller = require('../controllers/group.controller');
var authMiddleware = require('../middlewares/auth.middleware');


var router = express.Router();

router.get('/:groupId',authMiddleware.req, authMiddleware.requireLogin, controller.index);
router.get('/member/:groupId',authMiddleware.req, authMiddleware.requireLogin, controller.member);
router.post('/addMember',authMiddleware.req, authMiddleware.requireLogin, controller.addMember);
router.post('/remove',authMiddleware.req, authMiddleware.requireLogin, controller.remove);
router.post('/join',authMiddleware.req, authMiddleware.requireLogin, controller.join);

router.post("/create",authMiddleware.requireLogin, controller.create);

module.exports = router;