var productModel = require('../models/product')

exports.home = function(req, res) {
    productModel.getItems(function(items) {
        res.render('index', {
            Items: items,
            user: req.user
        });
    })
}