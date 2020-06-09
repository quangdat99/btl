var express = require('express');
var controller = require('../controllers/search.controller');
var authMiddleware = require('../middlewares/auth.middleware');


var router = express.Router();

router.post('/allUser', controller.postSearchAllUser);
router.post('/groupUser', controller.postSearchGroupUser);

module.exports = router;