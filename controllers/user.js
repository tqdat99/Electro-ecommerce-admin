const bcrypt = require('bcrypt');
const passport = require('passport');
// var Passport = require('passport').Passport,
//     passport = new Passport()
const initialize = require('../models/passport');
initialize(passport);

var userModel = require('../models/user')

module.exports.registerFormGet = function(req, res) {
    res.render('register', {
        msg: '',
        user: req.user
    });
}

module.exports.registerFormPost = async function(req, res, next) {
    var valid = true;
    user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        fullname: req.body.fullname,
        birthday: req.body.birthday,
        phone: req.body.phone,
        address: req.body.address
    }
    var password = req.body.password,
        username = req.body.username

    console.log(valid)
    userModel.findUserByUsername(username, function(foundUser) {
        userModel.validatePassword(password, function(ifValid) {
            if (foundUser != null) {
                console.log(foundUser)
                res.render('register', {
                    msg: 'Tên tài khoản đã tồn tại',
                    user: req.user
                })
            } else if (!ifValid) {
                console.log(ifValid)
                console.log('Mật khẩu phải có ít nhất 6 ký tự')
                return res.render('register', {
                    msg: 'Mật khẩu phải có ít nhất 6 ký tự',
                    user: req.user
                })
            } else {
                userModel.addUser(user)
                console.log('added')
                res.redirect('/user/login')
            }
        })
    })
}

module.exports.profile = function(req, res) {
    res.render('profile', {
        msg: '',
        user: req.user
    });
}

module.exports.profileEdit = function(req, res) {
    console.log("profileEdit:")
    console.log(req.body)
    userModel.editUserByUsername(req.body)
    res.render('profile', {
        msg: '',
        user: req.user
    });
}

module.exports.logInFormGet = function(req, res) {
    res.render('login', {
        user: req.user
    })
}

module.exports.logInFormPost = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
})

module.exports.logOut = function(req, res) {
    req.logout()
    res.redirect('/')
}

module.exports.checkAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
}

module.exports.checkNotAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}