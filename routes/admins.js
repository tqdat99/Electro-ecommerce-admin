var express = require('express');
var router = express.Router();
router.use(express.static('public'));

var adminController = require('../controllers/admins');

router.get('/create', adminController.checkAuthenticated, adminController.adminCreateForm);
router.post('/create', adminController.checkAuthenticated, adminController.adminCreate);
router.get('/details', adminController.checkAuthenticated, adminController.adminInfo);
router.post('/change-password', adminController.checkAuthenticated, adminController.adminChangePassword);
router.post('/delete', adminController.checkAuthenticated, adminController.adminDelete);
router.post('/lock', adminController.checkAuthenticated, adminController.adminLock);
router.post('/unlock', adminController.checkAuthenticated, adminController.adminUnlock);

module.exports = router;