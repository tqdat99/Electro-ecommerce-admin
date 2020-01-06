var express = require('express');
var router = express.Router();
router.use(express.static('public'));

var adminController = require('../controllers/admins');
var userController = require('../controllers/users');

router.get('/details', adminController.checkAuthenticated, userController.userInfo);
router.post('/lock', adminController.checkAuthenticated, userController.userLock);
router.post('/unlock', adminController.checkAuthenticated, userController.userUnlock);
router.route('/forgot-password')
    .get(userHandlers.render_forgot_password_template)
    .post(userHandlers.forgot_password);

module.exports = router;