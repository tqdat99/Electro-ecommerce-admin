var express = require('express');
var router = express.Router();
router.use(express.static('public'));

var indexController = require('../controllers/index');
var userController = require('../controllers/users');
var adminController = require('../controllers/admins');
var productController = require('../controllers/products');
var advertisementController = require('../controllers/advertisements');
var typeController = require('../controllers/types');
var orderController = require('../controllers/orders');
var topController = require('../controllers/top');
var saleController = require('../controllers/sales');


router.get('/', adminController.checkAuthenticated, userController.userList);
router.get('/login', adminController.checkNotAuthenticated, indexController.logInFormGet);
router.post('/login', adminController.checkNotAuthenticated, indexController.logInFormPost);
router.get('/logout', adminController.checkAuthenticated, indexController.logOut);
router.post('/logout', adminController.checkAuthenticated, indexController.logOut);

router.get('/users', adminController.checkAuthenticated, userController.userList);
router.get('/admins', adminController.checkAuthenticated, adminController.adminList);
router.get('/types', adminController.checkAuthenticated, typeController.typeList);
router.get('/products', adminController.checkAuthenticated, productController.productList);
router.get('/advertisements', adminController.checkAuthenticated, advertisementController.advertisementList);
router.get('/orders', adminController.checkAuthenticated, orderController.orderList);
router.get('/top', adminController.checkAuthenticated, topController.topList);
router.get('/sales', adminController.checkAuthenticated, saleController.salesManage);

// router.get('/manage-orders', function(req, res) {
//     res.render('admin/manage-orders');
// });
// router.get('/manage-orders-details', function(req, res) {
//     res.render('admin/manage-orders-details');
// });

// router.get('/manage-sales', function(req, res) {
//     res.render('admin/manage-sales');
// });

// router.get('/top-sales', function(req, res) {
//     res.render('admin/top-sales');
// });

module.exports = router;