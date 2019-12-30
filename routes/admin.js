var express = require('express');
var router = express.Router();
router.use(express.static('public'));

var adminController = require('../controllers/admin')

router.get('/', adminController.logInFormGet);

router.get('/login', adminController.logInFormGet);

router.post('/login', adminController.logInFormPost);

router.get('/manage-users', adminController.checkAuthenticated, adminController.userList);

router.get('/manage-users-details', adminController.checkAuthenticated, adminController.userInfo);

router.post('/lock-user', adminController.checkAuthenticated, adminController.userLock);

router.post('/unlock-user', adminController.checkAuthenticated, adminController.userUnlock);

router.get('/manage-products', adminController.checkAuthenticated, adminController.productList);

router.get('/manage-product-details', adminController.checkAuthenticated, adminController.productDetails);

router.post('/edit-product-details', adminController.checkAuthenticated, adminController.productEdit);

router.post('/remove-product', adminController.checkAuthenticated, adminController.productRemove);

router.post('/add-product', adminController.checkAuthenticated, adminController.productAdd);

router.get('/add-product-details', adminController.checkAuthenticated, adminController.productAddForm);

router.get('/manage-orders', function(req, res) {
    res.render('admin/manage-orders');
});

router.get('/manage-orders-details', function(req, res) {
    res.render('admin/manage-orders-details');
});

router.get('/manage-sales', function(req, res) {
    res.render('admin/manage-sales');
});

router.get('/top-sales', function(req, res) {
    res.render('admin/top-sales');
});

module.exports = router;