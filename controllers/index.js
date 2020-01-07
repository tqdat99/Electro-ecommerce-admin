const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

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