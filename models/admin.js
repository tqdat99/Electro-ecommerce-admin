const bcrypt = require('bcrypt')
    // const passportAdmin = require('passport');
var Passport = require('passport').Passport,
    passportAdmin = new Passport()
const LocalStrategy = require('passport-local').Strategy;
var database = require('./database')
var pool = database.pool

module.exports.getAllAdmins = function(callback) {
    query = 'select * from "Admins"'
    pool.query(query, function(err, result) {
        callback(result.rows);
    })
}

module.exports.addAdmin = async function(user) {
    const hasedPw = await bcrypt.hash(user.password, 10)
    user.password = hasedPw

    const query = {
        text: 'insert into "Admins" values($1, $2, $3, $4)',
        values: [user.username, user.password, 0, 'available'],
    }

    pool.query(query, (err, res) => {
        if (err)
            console.log(err.stack)
    })
}

module.exports.changAdminPasswordByUsername = async function(username, password) {
    const hasedPw = await bcrypt.hash(password, 10)

    query = "update \"Admins\" set password = '" + hasedPw + "' where username = '" + username + "'"
    console.log(query)

    pool.query(query, (err, res) => {
        console.log(res)
        if (err)
            console.log(err.stack)
    })
}

module.exports.lockUser = function(username) {
    query = "update \"Admins\" set status = \'locked\' where username = \'" + username + "\'"
    pool.query(query, function(err, result) {})
}

module.exports.unlockUser = function(username) {
    query = "update \"Admins\" set status = \'available\' where username = \'" + username + "\'"
    pool.query(query, function(err, result) {})
}

module.exports.findAdminByUsername = function(username, callback) {
    query = 'select * from "Admins" where username = \'' + username + '\''
    pool.query(query, async(err, res) => {
        // console.log(res)
        if (res.rows.length > 0)
            callback(res.rows[0])
        else
            callback(null)
    })
}

module.exports.deleteAdminByUsername = function(username, callback) {
    query = "delete from \"Admins\" where username = '" + username + "'"
    pool.query(query, function(err, result) {
        callback(result)
    })
}

module.exports.lockAdmin = function(username) {
    query = "update \"Admins\" set status = \'locked\' where username = \'" + username + "\'"
    pool.query(query, function(err, result) {})
}

module.exports.unlockAdmin = function(username) {
    query = "update \"Admins\" set status = \'available\' where username = \'" + username + "\'"
    pool.query(query, function(err, result) {})
}

module.exports.validatePassword = function(password, callback) {
    if (password.length < 6)
        return callback(false)
    callback(true)
}

module.exports.checkAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/admin/login')
}

module.exports.checkNotAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/admin/manage-users')
    }
    next()
}

module.exports.authenticateUser = function(req, res, next) {
    console.log('yes')
    passport.authenticate('local', {
        successRedirect: '/admin/manage-users',
        failureRedirect: '/admin/login',
        failureFlash: true
    })
}