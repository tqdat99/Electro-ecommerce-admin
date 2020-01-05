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

module.exports.logInFormGet = async function(req, res) {
    res.render('login', {
        admin: req.user
    })
}

module.exports.logInFormPost = passportAdmin.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/login',
    failureFlash: true
})

module.exports.logOut = function(req, res) {
    req.logout()
    res.redirect('/login')
}