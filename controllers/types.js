const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

var adminModel = require('../models/admin')
var userModel = require('../models/user')
var productModel = require('../models/product')
var bannerModel = require('../models/banner')
var typeModel = require('../models/type')

var formidable = require('formidable')
var appRoot = require('app-root-path')
var http = require('http')
var util = require('util')
var base64Img = require('base64-img');


module.exports.typeList = function(req, res) {

    var perPage = 5
    var page = 1

    // console.log(req.params)
    // console.log(req.query.page)

    if (req.params['page'] != undefined)
        page = req.params['page']
    if (req.query.page != undefined)
        page = req.query.page

    typeModel.getAllTypes(function(items) {
        onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + perPage)
        res.render('manage-types', {
            admin: req.user,
            Types: onPageItems,
            Page: page,
            user: req.user,
            current: page,
            pages: Math.ceil(items.length / perPage)
        });
    })
}

module.exports.typeDetails = function(req, res) {
    typeModel.getTypeById(req.query.id, function(type) {
        res.render('manage-type-details', {
            admin: req.user,
            type: type,
        });
    })
}

module.exports.typeEdit = function(req, res) {

    var form = { id: "", ten: "", anh: "", prefix: "" }

    new formidable.IncomingForm().parse(req, async function(err, fields, file) {
            form.id = fields.id
            form.ten = fields.ten
            form.prefix = fields.prefix
            if (file.anh.size > 0) {
                console.log(file.thumbnail)
                form.anh = await base64Img.base64Sync(file.anh.path);
            }
            redirect = "/types/details?id=" + form.id
            typeModel.editTypeById(form, function(resultEdit) {
                console.log(redirect)
                res.redirect(redirect)
            })
        })
        .on('fileBegin', function(name, file) {
            // file.path = appRoot + "/public/images/products/" + file.name
            // productForm.anh = file.path
            // console.log('Path:', file.path);
        })
        .on('file', async function(name, file) {
            // console.log('Uploaded Got name:', name);
            // console.log('Uploaded Got file:', file);
            // if (name == "images" && file.size > 0) {
            //     img = await base64Img.base64Sync(file.path);
            //     images.push(img)
            // }
            // if (name == "thumbnail" && file.size > 0) {
            //     console.log(file)
            //     productForm.anh = await base64Img.base64Sync(file.path);
            //     console.log("productForm.anh:")
            //     console.log(productForm.anh)
            //         productForm.anh = file.path;
            // }
        })
        .on('field', function(name, field) {
            // console.log('Got a name:', name);
            // console.log('Got a field:', field);
        })
        .on('error', function(err) {
            next(err);
        })
}

module.exports.typeAdd = function(req, res) {

    var form = { id: "", ten: "", anh: "", prefix: "" }

    new formidable.IncomingForm().parse(req, async function(err, fields, file) {
            form.id = fields.id
            form.ten = fields.ten
            form.prefix = fields.prefix
            redirect = "/types/details?id=" + form.id
            form.anh = await base64Img.base64Sync(file.anh.path);
            //console.log(form)
            typeModel.addType(form, function(addResult) {
                console.log(redirect)
                res.redirect(redirect)
            })
        })
        .on('fileBegin', function(name, file) {
            // file.path = appRoot + "/public/images/products/" + file.name
            // productForm.anh = file.path
            // console.log('Path:', file.path);
        })
        .on('file', async function(name, file) {
            // console.log('Uploaded Got name:', name);
            // console.log('Uploaded Got file:', file);
            // form.anh = await base64Img.base64Sync(file.path);
            // productForm.anh = file.path;
        })
        .on('field', function(name, field) {
            // console.log('Got a name:', name);
            // console.log('Got a field:', field);
        })
        .on('error', function(err) {
            next(err);
        })
}

module.exports.typeRemove = function(req, res) {
    typeModel.removeTypeById(req.query.id, function(result) {
        res.redirect('/types')
    })
}

module.exports.typeAddForm = function(req, res) {
    res.render('add-type-details', {
        admin: req.user,
    })
}