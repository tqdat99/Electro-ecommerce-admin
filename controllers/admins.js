const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

var adminModel = require('../models/admin')
var userModel = require('../models/user')
var productModel = require('../models/product')
var advertisementModel = require('../models/banner')
var typeModel = require('../models/type')

var formidable = require('formidable')
var appRoot = require('app-root-path')
var http = require('http')
var util = require('util')
var base64Img = require('base64-img');


module.exports.adminList = function(req, res) {
    var perPage = 5
    var page = 1

    // console.log(req.params)
    // console.log(req.query.page)

    if (req.params['page'] != undefined)
        page = req.params['page']
    if (req.query.page != undefined)
        page = req.query.page

    adminModel.getAllAdmins(function(items) {
        onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + perPage)
        res.render('manage-admins', {
            admin: req.user,
            Users: onPageItems,
            Page: page,
            current: page,
            pages: Math.ceil(items.length / perPage)
        });
    })
}

module.exports.adminCreateForm = function(req, res) {
    res.render('create-admin-form', {
        admin: req.user,
        msg: ''
    });
}

module.exports.adminCreate = async function(req, res, next) {
    var valid = true;
    newAdmin = {
        username: req.body.username,
        password: req.body.password,
    }
    var password = req.body.password,
        username = req.body.username

    adminModel.findAdminByUsername(username, function(foundAdmin) {
        adminModel.validatePassword(password, async function(ifValid) {
            if (foundAdmin != null) {
                // console.log(foundAdmin)
                res.render('create-admin-form', {
                    msg: 'Tên tài khoản admin đã tồn tại',
                    admin: req.user
                })
            } else if (!ifValid) {
                // console.log(ifValid)
                // console.log('Mật khẩu phải có ít nhất 6 ký tự')
                return res.render('create-admin-form', {
                    msg: 'Mật khẩu phải có ít nhất 6 ký tự',
                    admin: req.user
                })
            } else {
                await adminModel.addAdmin(newAdmin)
                    // console.log('added')
                redirect = '/admins/details?username=' + username
                res.redirect(redirect)
            }
        })
    })
}

module.exports.adminInfo = function(req, res) {
    // console.log(req.query)
    username = req.query.username
    adminModel.findAdminByUsername(username, function(user) {
        // console.log("username:" + username)
        // console.log("found:" + user)
        res.render('manage-admin-details', {
            admin: req.user,
            user: user,
        });
    })
}

module.exports.adminChangePassword = function(req, res, next) {
    adminModel.changAdminPasswordByUsername(req.body.username, req.body.password)
    redirect = '/admins/details?username=' + username
    res.redirect(redirect)
}


module.exports.adminDelete = function(req, res) {
    username = req.query.username
    adminModel.deleteAdminByUsername(username, function(user) {
        res.redirect('/admins')
    })
}

module.exports.adminLock = function(req, res) {
    username = req.query.username
    redirect = "/admins/details?username=" + username
    adminModel.lockAdmin(username)
    res.redirect(redirect)
}

module.exports.adminUnlock = function(req, res) {
    username = req.query.username
    redirect = "/admins/details?username=" + username
    adminModel.unlockAdmin(username)
    res.redirect(redirect)
}


module.exports.checkAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports.checkNotAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/users');
    }
    next();
}