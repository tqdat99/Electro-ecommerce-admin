var express = require('express');
var router = express.Router();
router.use(express.static('public'));

router.get('/', function(req, res) {
    res.render('account');
});

router.get('/order-details', function(req, res) {
    res.render('order-details');
});

module.exports = router;