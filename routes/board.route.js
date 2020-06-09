var express = require('express');
var controller = require('../controllers/board.controller');
var authMiddleware = require('../middlewares/auth.middleware');



var router = express.Router();

router.get('/:boardId',authMiddleware.req, authMiddleware.requireLogin, controller.index);
router.post('/create',authMiddleware.req, authMiddleware.requireLogin, controller.create);
router.post('/changeBackground', authMiddleware.req, authMiddleware.requireLogin, controller.changeBackground);


module.exports = router;