var express = require('express');
var router = express.Router();
router.use(express.static('public'));

var adminController = require('../controllers/admins');
var typeController = require('../controllers/types');

router.get('/details', adminController.checkAuthenticated, typeController.typeDetails);
router.post('/edit', adminController.checkAuthenticated, typeController.typeEdit);
router.post('/remove', adminController.checkAuthenticated, typeController.typeRemove);
router.post('/add', adminController.checkAuthenticated, typeController.typeAdd);
router.get('/add', adminController.checkAuthenticated, typeController.typeAddForm);

module.exports = router;