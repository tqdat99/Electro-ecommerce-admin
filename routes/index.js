var express = require('express');
var router = express.Router();

var index = require('../controllers/index')

/* GET home page. */
router.get('/', index.home)

/*router.get('/cart', function(req, res) {
    res.render('cart');
});

router.get('/checkout', function(req, res) {
    res.render('checkout');
});

router.get('/forget-password', function(req, res) {
    res.render('forget-password');
});

router.get('/account', function(req, res) {
    res.render('account');
});

router.get('/admin', function(req, res) {
    res.render('admin/signin');
});*/

module.exports = router;

