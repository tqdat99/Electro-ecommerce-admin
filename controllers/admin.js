const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

var adminModel = require('../models/admin')
var userModel = require('../models/user')
var productModel = require('../models/product')
var formidable = require('formidable')
var appRoot = require('app-root-path')
var http = require('http')
var util = require('util')

module.exports.logInFormGet = async function(req, res) {
    res.render('admin/login', {
        user: req.user
    })
}

module.exports.logInFormPost = passportAdmin.authenticate('local', {
    successRedirect: '/admin/manage-users',
    failureRedirect: '/admin/login',
    failureFlash: true
})

module.exports.logOut = function(req, res) {
    req.logout()
    res.redirect('/admin/login')
}

module.exports.userList = function(req, res) {
    var perPage = 5
    var page = 1

    console.log(req.params)
    console.log(req.query.page)

    if (req.params['page'] != undefined)
        page = req.params['page']
    if (req.query.page != undefined)
        page = req.query.page

    userModel.getAllUser(function(items) {
        onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + perPage)
        res.render('admin/manage-users', {
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
        res.render('admin/manage-users-details', {
            user: user,
        });
    })
}

module.exports.userLock = function(req, res) {
    username = req.query.username
    redirect = "manage-users-details?username=" + username
    userModel.lockUser(username,
        userModel.findUserByUsername(username, function(user) {
            res.redirect(redirect)
        })
    )
}

module.exports.userUnlock = function(req, res) {
    username = req.query.username
    redirect = "manage-users-details?username=" + username
    userModel.unlockUser(username,
        userModel.findUserByUsername(username, function(user) {
            res.redirect(redirect)
        })
    )
}

module.exports.productList = function(req, res) {
    var perPage = 9
    var page = 1

    type = []
    brand = []
    var order = 'asc'
    price = undefined
    key = undefined

    // console.log(req)
    // console.log(req.query.type)
    // console.log(req.query.brand)

    if (req.params['key'] != undefined) {
        key = req.params['key']
    }
    if (req.query.key != undefined) {
        key = req.query.key
    }

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
        type = ['Laptop', 'Tivi', 'Dienthoai']
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

    if (req.params['page'] != undefined)
        page = req.params['page']
    if (req.query.page != undefined)
        page = req.query.page

    if (req.query.price != undefined)
        price = req.query.price

    // console.log("controller:")
    // console.log(type)
    // console.log(brand)
    // console.log(price)

    productModel.getProductList(key, type, brand, price, order, function(items) {
        // console.log(page + "," + items.length + "," + perPage + "," + Math.ceil(items.length / perPage))
        // console.log(items)
        onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + 9)
            // console.log(onPageItems)
        res.render('admin/manage-products', {
            Items: onPageItems,
            Type: type,
            Brand: brand,
            Order: order,
            Page: page,
            user: req.user,
            current: page,
            pages: Math.ceil(items.length / perPage)
        });
    })
}

module.exports.productEdit = function(req, res) {

    var productForm = { id: "", ten: "", gia: "", mota: "", anh: "", loai: "", brand: "", kho: "" }

    new formidable.IncomingForm().parse(req, function(err, fields, file) {
            productForm.id = fields.id
            productForm.ten = fields.ten
            productForm.gia = fields.gia
            productForm.mota = fields.mota
            productForm.loai = fields.loai
            productForm.brand = fields.brand
            productForm.kho = fields.kho
            if (file.upload.size == 0) {
                productForm.anh = fields.anh
            } else {
                console.log("File below")
                console.log(file)
                console.log(file.upload.name)
                productForm.anh = "/images/products/" + file.upload.name
                productForm.anh = productForm.anh.replace(/\\/g, "/")
            }
            console.log(productForm)
            redirect = "manage-product-details?id=" + productForm.id
            productModel.editProductById(productForm, function(item) {
                console.log(redirect)
                res.redirect(redirect)
            })
        })
        .on('fileBegin', function(name, file) {
            if (file.name != "") {
                file.path = appRoot + "/public/images/products/" + file.name
                productForm.anh = file.path
                console.log('Path:', file.path);
            }
        })
        .on('file', function(name, file) {
            console.log('Uploaded Got name:', name);
            console.log('Uploaded Got file:', file);
        })
        .on('field', function(name, field) {
            console.log('Got a name:', name);
            console.log('Got a field:', field);
        })
        .on('error', function(err) {
            next(err);
        })
}

module.exports.productAdd = function(req, res) {

    var productForm = { id: "", ten: "", gia: "", mota: "", anh: "", loai: "", brand: "", kho: "" }

    new formidable.IncomingForm().parse(req, function(err, fields, file) {
            productForm.id = fields.id
            productForm.ten = fields.ten
            productForm.gia = fields.gia
            productForm.mota = fields.mota
            productForm.loai = fields.loai
            productForm.brand = fields.brand
            productForm.kho = fields.kho
                // console.log("File below")
                // console.log(file)
                // console.log(file.upload.name)
            productForm.anh = "/images/products/" + file.upload.name
            productForm.anh = productForm.anh.replace(/\\/g, "/")
                // console.log(productForm)
            redirect = "manage-product-details?id=" + productForm.id
            productModel.addProduct(productForm, function(item) {
                // console.log(redirect)
                res.redirect(redirect)
            })
        })
        .on('fileBegin', function(name, file) {
            file.path = appRoot + "/public/images/products/" + file.name
            productForm.anh = file.path
                // console.log('Path:', file.path);
        })
        .on('file', function(name, file) {
            // console.log('Uploaded Got name:', name);
            // console.log('Uploaded Got file:', file);
        })
        .on('field', function(name, field) {
            // console.log('Got a name:', name);
            // console.log('Got a field:', field);
        })
        .on('error', function(err) {
            next(err);
        })
}

module.exports.productRemove = function(req, res) {
    id = req.query.id
    redirect = "manage-products"
    productModel.removeProductById(id, function(user) {
        res.redirect(redirect)
    })
}

module.exports.productDetails = function(req, res) {
    productModel.getProductDetailById(req.query.id, function(item) {
        res.render('admin/manage-product-details', {
            item: item,
        })
    })
}

module.exports.productAddForm = function(req, res) {
    productModel.getProductList(undefined, [], [], undefined, 'asc', function(items) {
        numDienthoai = 0
        numLaptop = 0
        numTivi = 0
        for (i = 0; i < items.length; i++) {
            if (items[i].id.substring(0, 2) == "DT")
                numDienthoai++
                if (items[i].id.substring(0, 2) == "LT")
                    numLaptop++
                    if (items[i].id.substring(0, 2) == "TV")
                        numTivi++
        }
        res.render('admin/add-product-details', {
            numDienthoai: numDienthoai,
            numLaptop: numLaptop,
            numTivi: numTivi,
        });
    })
}

module.exports.checkAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
}

module.exports.checkNotAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/admin/manage-users');
    }
    next();
}