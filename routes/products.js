var express = require('express');
var router = express.Router();
router.use(express.static('public'));

var adminController = require('../controllers/admins');
var productController = require('../controllers/products');

router.get('/details', adminController.checkAuthenticated, productController.productDetails);
router.post('/edit', adminController.checkAuthenticated, productController.productEdit);
router.post('/remove', adminController.checkAuthenticated, productController.productRemove);
router.get('/remove-product-image', adminController.checkAuthenticated, productController.productImageRemove);
router.post('/add', adminController.checkAuthenticated, productController.productAdd);
router.get('/add', adminController.checkAuthenticated, productController.productAddForm);

module.exports = router;