const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

var adminModel = require('../models/admin')
var userModel = require('../models/user')
var productModel = require('../models/product')
var advertisementModel = require('../models/advertisement')
var typeModel = require('../models/type')

var formidable = require('formidable')
var appRoot = require('app-root-path')
var http = require('http')
var util = require('util')
var base64Img = require('base64-img');

module.exports.userList = function(req, res) {
    console.log(req.user)

    var perPage = 5
    var page = 1

    // console.log(req.params)
    // console.log(req.query.page)

    if (req.params['page'] != undefined)
        page = req.params['page']
    if (req.query.page != undefined)
        page = req.query.page

    userModel.getAllUser(function(items) {
        onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + perPage)
        res.render('manage-users', {
            admin: req.user,
            Users: onPageItems,
            Page: page,
            user: req.user,
            current: page,
            pages: Math.ceil(items.length / perPage)
        });
    })
}

module.exports.userInfo = function(req, res) {
    username = req.query.username
    userModel.findUserByUsername(username, function(user) {
        res.render('manage-users-details', {
            admin: req.user,
            user: user,
        });
    })
}



module.exports.userLock = function(req, res) {
    username = req.query.username
    redirect = "/users/details?username=" + username
    userModel.lockUser(username)
    res.redirect(redirect)
}

module.exports.userUnlock = function(req, res) {
    username = req.query.username
    redirect = "/users/details?username=" + username
    userModel.unlockUser(username)
    res.redirect(redirect)
}