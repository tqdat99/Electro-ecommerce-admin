const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

var adminModel = require('../models/admin')
var userModel = require('../models/user')
var productModel = require('../models/product')
var bannerModel = require('../models/banner')
var typeModel = require('../models/type')
var orderModel = require('../models/order')

var formidable = require('formidable')
var appRoot = require('app-root-path')
var http = require('http')
var util = require('util')
var base64Img = require('base64-img');


module.exports.orderList = function(req, res) {

    var perPage = 5
    var page = 1

    // console.log(req.params)
    // console.log(req.query.page)

    if (req.params['page'] != undefined)
        page = req.params['page']
    if (req.query.page != undefined)
        page = req.query.page

    orderModel.getOrderList(function(items) {
        onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + perPage)
        res.render('manage-orders', {
            admin: req.user,
            Orders: onPageItems,
            Page: page,
            current: page,
            pages: Math.ceil(items.length / perPage)
        });
    })
}

module.exports.orderDetails = function(req, res) {
    orderid = req.query.orderid;
    orderModel.findOrderById(orderid, function(order) {
        orderModel.getOrderStatusById(orderid, function(status) {
            orderModel.getOrderProductsById(orderid, function(products) {
                //console.log(products)
                var CreatedAt, Shipping, ShippedAt, CanceledAt
                for (i = 0; i < status.length; i++) {
                    if (status[i].status == '1')
                        CreatedAt = status[i].time
                    else if (status[i].status == '2')
                        Shipping = status[i].time
                    else if (status[i].status == '3')
                        ShippedAt = status[i].time
                    else if (status[i].status == '-1')
                        CanceledAt = status[i].time
                }
                res.render('manage-order-details', {
                    admin: req.user,
                    Order: order,
                    Products: products,
                    CreatedAt: CreatedAt,
                    Shipping: Shipping,
                    ShippedAt: ShippedAt,
                    CanceledAt: CanceledAt,
                })
            })
        })
    })

}

module.exports.orderStatusSet = function(req, res) {
    console.log(req)
    console.log(req.query.orderid)
    console.log(req.query.status)
    orderModel.setOrderStatusById(req.query.orderid, req.query.status, function(result) {
        redirect = '/orders/details?orderid=' + req.query.orderid
        res.redirect(redirect)
    })
}