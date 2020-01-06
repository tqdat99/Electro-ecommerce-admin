const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

var adminModel = require('../models/admin')
var userModel = require('../models/user')
var productModel = require('../models/product')
var advertisementModel = require('../models/advertisement')
var typeModel = require('../models/type')
var saleModel = require('../models/sale')

var formidable = require('formidable')
var appRoot = require('app-root-path')
var http = require('http')
var util = require('util')
var base64Img = require('base64-img');

module.exports.salesManage = function(req, res) {

    var perPage = 5
    var page = 1

    if (req.query.from != undefined && req.query.to != undefined) {
        from = req.query.from
        to = req.query.to
    } else {
        day = new Date().getDate()
        if (day < 10)
            day = "0" + day
        month = new Date().getMonth() + 1
        if (month < 10)
            month = "0" + month
        year = new Date().getFullYear()
        while (year.length < 4) year = "0" + year
        from = year + "-" + month + "-" + day
        to = from
    }

    if (req.params['page'] != undefined)
        page = req.params['page']
    if (req.query.page != undefined)
        page = req.query.page

    saleModel.getSales(from, to, function(items) {
        console.log(items)
        sumSale = 0
        for (i = 0; i < items.length; i++)
            sumSale += parseInt(items[i].sum, 10)
        onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + 9)
        res.render('manage-sales', {
            From: from,
            To: to,
            admin: req.user,
            Sum: sumSale,
            Orders: onPageItems,
            Page: page,
            current: page,
            pages: Math.ceil(items.length / perPage)
        });
    })
}