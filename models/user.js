const bcrypt = require('bcrypt')
    // const passportAdmin = require('passport');
var Passport = require('passport').Passport,
    passport = new Passport()
const LocalStrategy = require('passport-local').Strategy;
var database = require('./database')
var pool = database.pool

module.exports.getAllUser = function(callback) {
    query = 'select * from "Users"'
    pool.query(query, function(err, result) {
        callback(result.rows);
    })
}

module.exports.addUser = async function(user) {
    const hasedPw = await bcrypt.hash(user.password, 10)
    user.password = hasedPw

    const query = {
        text: 'insert into "Users" values($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [user.username, user.password, user.fullname, user.birthday, user.address, user.phone, user.email, 'available'],
    }

    pool.query(query, (err, res) => {
        if (err)
            console.log(err.stack)
    })
}

module.exports.editUserByUsername = function(form) {
    // const query = {
    //         text: 'update "Users" set password = \'$1\', fullname = \'$2\', birthday = \'$3\', address = \'$4\', phone = \'$5\' where username = \'$6\'',
    //         values: [form.password, form.fullname, form.birthday, form.address, form.phone, form.username],
    //     }
    query = "update \"Users\" set password = '" + form.password + "', fullname = '" + form.fullname + "', birthday = '" + form.birthday +
        "', address = '" + form.address + "', phone = '" + form.phone + "' where username = '" + form.username + "'"
    console.log(query)
    pool.query(query, function(err, result) {
        console.log(result)
    })
}

module.exports.lockUser = function(username) {
    query = "update \"Users\" set status = \'locked\' where username = \'" + username + "\'"
    pool.query(query, function(err, result) {})
}

module.exports.unlockUser = function(username) {
    query = "update \"Users\" set status = \'available\' where username = \'" + username + "\'"
    pool.query(query, function(err, result) {})
}

module.exports.findUserByUsername = function(username, callback) {
    query = 'select * from "Users" where username = \'' + username + '\''
    pool.query(query, async(err, res) => {
        if (res.rows.length > 0)
            callback(res.rows[0])
        else
            callback(null)
    })
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
    res.redirect('/user/login')
}

module.exports.checkNotAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports.authenticateUser = function(req, res, next) {
    console.log('yes')
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })
}