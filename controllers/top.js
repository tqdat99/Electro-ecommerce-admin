const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

var adminModel = require('../models/admin')
var userModel = require('../models/user')
var productModel = require('../models/product')
var advertisementModel = require('../models/banner')
var typeModel = require('../models/type')
var topModel = require('../models/top')

var formidable = require('formidable')
var appRoot = require('app-root-path')
var http = require('http')
var util = require('util')
var base64Img = require('base64-img');

module.exports.topList = function(req, res) {

    type = []
    brand = []
    var order = 'asc'

    // console.log(req)
    // console.log(req.query.type)
    // console.log(req.query.brand)


    if (req.params['type'] != undefined) {
        type.push(req.params['type'])
    }
    if (req.query.type != undefined) {
        // console.log("type: " + req.query.type.length)
        if (!Array.isArray(req.query.type))
            type.push(req.query.type)
        else
            type = req.query.type
    }
    if (req.query.type == 'All') {
        type = undefined
    }

    if (req.params['brand'] != undefined) {
        brand.push(req.params['brand'])
    }
    if (req.query.brand != undefined) {
        // console.log("brand: " + req.query.brand.length)
        if (!Array.isArray(req.query.brand))
            brand.push(req.query.brand)
        else
            brand = req.query.brand
    }

    if (req.params['order'] != undefined)
        order = req.params['order']
    if (req.query.order != undefined)
        order = req.query.order

    // console.log("controller:")
    // console.log(type)
    // console.log(brand)
    // console.log(price)

    topModel.getToptList(type, brand, order, function(items) {
        // console.log(page + "," + items.length + "," + perPage + "," + Math.ceil(items.length / perPage))
        // console.log(items)
        productModel.getProductTypes(function(types) {
            productModel.getProductBrands(function(brands) {
                res.render('top', {
                    Items: items,
                    Type: type,
                    Brand: brand,
                    Order: order,
                    admin: req.user,
                    Brands: brands,
                    Types: types,
                });
            })
        })
    })
}