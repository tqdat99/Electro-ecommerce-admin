var express = require('express');
var router = express.Router();
router.use(express.static('public'));

var adminController = require('../controllers/admins');
var orderController = require('../controllers/orders');

router.get('/details', adminController.checkAuthenticated, orderController.orderDetails);
// router.post('/edit', adminController.checkAuthenticated, orderController.typeEdit);
// router.post('/remove', adminController.checkAuthenticated, orderController.typeRemove);
// router.post('/add', adminController.checkAuthenticated, orderController.typeAdd);
// router.get('/add', adminController.checkAuthenticated, orderController.typeAddForm);

module.exports = router;