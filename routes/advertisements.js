var express = require('express');
var router = express.Router();
router.use(express.static('public'));

var adminController = require('../controllers/admins');
var advertisementController = require('../controllers/advertisements');

router.get('/details', adminController.checkAuthenticated, advertisementController.advertisementDetails);
router.post('/edit', adminController.checkAuthenticated, advertisementController.advertisementEdit);
router.post('/remove', adminController.checkAuthenticated, advertisementController.advertisementRemove);
router.post('/add', adminController.checkAuthenticated, advertisementController.advertisementAdd);
router.post('/lock', adminController.checkAuthenticated, advertisementController.advertisementLock);
router.post('/unlock', adminController.checkAuthenticated, advertisementController.advertisementUnlock);
router.get('/add', adminController.checkAuthenticated, advertisementController.advertisementAddForm);

module.exports = router;