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
        productModel.getProductTypes(function(types) {
            productModel.getProductBrands(function(brands) {
                onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + 9)
                    //console.log(brands)
                    // console.log(types)
                res.render('manage-products', {
                    Items: onPageItems,
                    Type: type,
                    Brand: brand,
                    Order: order,
                    Page: page,
                    admin: req.user,
                    current: page,
                    Brands: brands,
                    Types: types,
                    pages: Math.ceil(items.length / perPage)
                });
            })
        })
    })
}

module.exports.productEdit = function(req, res) {

    var productForm = { id: "", ten: "", gia: "", mota: "", anh: "", loai: "", brand: "", kho: "" },
        images = []

    new formidable.IncomingForm().parse(req, async function(err, fields, file) {
            productForm.id = fields.id
            productForm.ten = fields.ten
            productForm.gia = fields.gia
            productForm.mota = fields.mota
            productForm.loai = fields.loai
            productForm.brand = fields.brand
            productForm.kho = fields.kho
            console.log("File ne")
            console.log(file)
            if (file.thumbnail.size > 0) {
                console.log(file.thumbnail)
                productForm.anh = await base64Img.base64Sync(file.thumbnail.path);
            }
            redirect = "/products/details?id=" + productForm.id
            console.log(images)
            productModel.editProductById(productForm, function(resultEdit) {
                productModel.addProductImages(productForm.id, images, function(resultAdd) {
                    console.log(redirect)
                    res.redirect(redirect)
                })
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
            if (name == "images" && file.size > 0) {
                img = await base64Img.base64Sync(file.path);
                images.push(img)
            }
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

module.exports.productAdd = function(req, res) {

    var productForm = { id: "", ten: "", gia: "", mota: "", anh: "", loai: "", brand: "", kho: "" },
        images = []

    new formidable.IncomingForm().parse(req, async function(err, fields, file) {
            productForm.loai = fields.loai
            productModel.getNextIdForProductAdd(productForm.loai, function(nextId) {
                productForm.id = nextId
                productForm.ten = fields.ten
                productForm.gia = fields.gia
                productForm.mota = fields.mota
                productForm.brand = fields.brand
                productForm.kho = fields.kho
                redirect = "/products/details?id=" + productForm.id
                productModel.addProduct(productForm, function(resultAddProduct) {
                    productModel.addProductImages(productForm.id, images, function(resultAddProduct) {
                        // res.end()
                        res.redirect(redirect)
                    })
                })
            })

        })
        .on('file', async function(name, file) {
            // console.log('Uploaded Got name:', name);
            // console.log('Uploaded Got file:', file);
            if (name == "images") {
                img = await base64Img.base64Sync(file.path);
                images.push(img)
                    // images.push(file.path)
            }

            if (name == "thumbnail") {
                productForm.anh = await base64Img.base64Sync(file.path);
                // productForm.anh = file.path;
            }
        })
        .on('error', function(err) {
            next(err);
        })
}

module.exports.productRemove = function(req, res) {
    id = req.query.id
    redirect = "/products?type=All"
    productModel.removeProductById(id, function(item) {
        res.redirect(redirect)
    })
}

module.exports.productImageRemove = function(req, res) {
    console.log(req)
    id = req.query.id
    redirect = "/products/details?id=" + id
    productModel.removeProductImageByImageId(req.query.imgId)
    res.redirect(redirect)
}

module.exports.productDetails = function(req, res) {
    //console.log(req.query.id)
    productModel.getProductDetailById(req.query.id, function(item) {
        productModel.getProductImagesById(req.query.id, function(images) {
            //console.log(req.query.id)
            //console.log(item.name)
            res.render('manage-product-details', {
                item: item,
                images: images,
                admin: req.user
            })
        })
    })
}

module.exports.productAddForm = function(req, res) {
    var generatedId = []
    productModel.getProductList(undefined, [], [], undefined, 'asc', function(items) {
        productModel.getProductTypes(function(types) {
            productModel.getProductBrands(function(brands) {
                brandsArray = []
                for (i = 0; i < brands.length; i++)
                    brandsArray.push(brands[i].brand)
                console.log(brandsArray)
                res.render('add-product-details', {
                    admin: req.user,
                    Brands: brandsArray,
                    Types: types
                });
            })
        })
    })
}