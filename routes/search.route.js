var express = require('express');
var controller = require('../controllers/search.controller');
var authMiddleware = require('../middlewares/auth.middleware');


var router = express.Router();

router.get('/allUser', controller.postSearchAllUser);
router.get('/groupUser', controller.postSearchGroupUser);

module.exports = router;