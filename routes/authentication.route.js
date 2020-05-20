var express = require('express');
var controller = require('../controllers/authentication.controller');


var router = express.Router();

router.get('/login', controller.login);
router.post('/login', controller.postLogin);
router.get('/register', controller.register);
router.post('/register', controller.postRegister);
router.get('/forgetPassword', controller.forgetPassword);
router.post('/forgetPassword', controller.postForgetPassword);

module.exports = router;