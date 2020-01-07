const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

var adminModel = require('../models/admin')
var userModel = require('../models/user')
var productModel = require('../models/product')
var advertisementModel = require('../models/advertisement')

var formidable = require('formidable')


module.exports.advertisementList = function(req, res) {

    var perPage = 5
    var page = 1

    // console.log(req.params)
    // console.log(req.query.page)

    if (req.params['page'] != undefined)
        page = req.params['page']
    if (req.query.page != undefined)
        page = req.query.page

    advertisementModel.getAllAdvertisements(function(items) {
        onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + perPage)
        res.render('manage-advertisements', {
            admin: req.user,
            Advertisements: onPageItems,
            Page: page,
            current: page,
            pages: Math.ceil(items.length / perPage)
        });
    })
}

module.exports.advertisementDetails = function(req, res) {
    //console.log(req.query)
    advertisementModel.getAdvertisementById(req.query.id, function(ad) {
        //console.log(ad)
        res.render('manage-advertisement-details', {
            advertisement: ad,
            admin: req.user
        })
    })
}


module.exports.advertisementEdit = function(req, res) {

    var form = { id: "", anh: "", link: "" }

    new formidable.IncomingForm().parse(req, async function(err, fields, file) {
            form.id = fields.id
            form.link = fields.link
            redirect = "/advertisements/details?id=" + form.id
            if (file.anh.size > 0) {
                console.log(file)
                form.anh = await base64Img.base64Sync(file.anh.path);
            }
            advertisementModel.editAdvertisementById(form, function(resultEdit) {
                // console.log(redirect)
                res.redirect(redirect)
            })
        })
        .on('fileBegin', function(name, file) {
            // file.path = appRoot + "/public/images/products/" + file.name
            // form.anh = file.path
            // console.log('Path:', file.path);
        })
        .on('file', async function(name, file) {
            // console.log('Uploaded Got name:', name);
            // console.log('Uploaded Got file:', file);
            // if (file.size > 0) {
            //     console.log(file)
            //     form.anh = await base64Img.base64Sync(file.path);
            // }
            // form.anh = file.path;

        })
        .on('field', function(name, field) {
            // console.log('Got a name:', name);
            // console.log('Got a field:', field);
        })
        .on('error', function(err) {
            next(err);
        })
}

module.exports.advertisementAdd = function(req, res) {

    var form = { id: "", anh: "", link: "" }

    new formidable.IncomingForm().parse(req, function(err, fields, file) {
            advertisementModel.getNextIdForAdvertisementAdd(function(nextId) {
                console.log("nextId: " + nextId)
                form.id = nextId
                form.link = fields.link
                redirect = "/advertisements/details?id=" + form.id
                advertisementModel.addAdvertisement(form, function(addResult) {
                    console.log(redirect)
                    res.redirect(redirect)
                })
            })
        })
        .on('fileBegin', function(name, file) {
            // file.path = appRoot + "/public/images/products/" + file.name
            // form.anh = file.path
            // console.log('Path:', file.path);
        })
        .on('file', async function(name, file) {
            // console.log('Uploaded Got name:', name);
            // console.log('Uploaded Got file:', file);
            form.anh = await base64Img.base64Sync(file.path);
            // form.anh = file.path;
        })
        .on('field', function(name, field) {
            // console.log('Got a name:', name);
            // console.log('Got a field:', field);
        })
        .on('error', function(err) {
            next(err);
        })
}

module.exports.advertisementRemove = function(req, res) {
    advertisementModel.removeAdvertisementById(req.query.id, function(result) {
        console.log("yes")
        res.redirect('/advertisements')
    })
}

module.exports.advertisementLock = function(req, res) {
    console.log('advertisementLock')
    redirect = "/advertisements/details?id=" + req.query.id
    advertisementModel.lockAdvertisementById(req.query.id, function(result) {
        console.log(redirect)
        res.redirect(redirect)
    })
}

module.exports.advertisementUnlock = function(req, res) {
    console.log('advertisementUnlock')
    redirect = "/advertisements/details?id=" + req.query.id
    advertisementModel.unlockAdvertisementById(req.query.id, function(result) {
        console.log(redirect)
        res.redirect(redirect)
    })
}

module.exports.advertisementAddForm = function(req, res) {
    res.render('add-advertisement-details', {
        admin: req.user,
    })
}