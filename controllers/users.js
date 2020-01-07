const bcrypt = require('bcrypt');
const passportAdmin = require('passport');
const initializeAdmin = require('../models/passport');
initializeAdmin(passportAdmin);

var userModel = require('../models/user')

module.exports.userList = function(req, res) {
    console.log(req.user)

    var perPage = 5
    var page = 1

    // console.log(req.params)
    // console.log(req.query.page)

    if (req.params['page'] != undefined)
        page = req.params['page']
    if (req.query.page != undefined)
        page = req.query.page

    userModel.getAllUser(function(items) {
        onPageItems = items.slice(perPage * (page - 1), perPage * (page - 1) + perPage)
        res.render('manage-users', {
            admin: req.user,
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
        res.render('manage-users-details', {
            admin: req.user,
            user: user,
        });
    })
}



module.exports.userLock = function(req, res) {
    username = req.query.username
    redirect = "/users/details?username=" + username
    userModel.lockUser(username)
    res.redirect(redirect)
}

module.exports.userUnlock = function(req, res) {
    username = req.query.username
    redirect = "/users/details?username=" + username
    userModel.unlockUser(username)
    res.redirect(redirect)
}

module.exports.forgot_password = function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({
                email: req.body.email
            }).exec(function(err, user) {
                if (user) {
                    done(err, user);
                } else {
                    done('User not found.');
                }
            });
        },
        function(user, done) {
            // create the random token
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function(user, token, done) {
            User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
                done(err, token, new_user);
            });
        },
        function(token, user, done) {
            var data = {
                to: user.email,
                from: email,
                template: 'forgot-password-email',
                subject: 'Password help has arrived!',
                context: {
                    url: 'http://localhost:3000/auth/reset_password?token=' + token,
                    name: user.fullName.split(' ')[0]
                }
            };

            smtpTransport.sendMail(data, function(err) {
                if (!err) {
                    return res.json({ message: 'Kindly check your email for further instructions' });
                } else {
                    return done(err);
                }
            });
        }
    ], function(err) {
        return res.status(422).json({ message: err });
    });
};

exports.reset_password = function(req, res, next) {
    User.findOne({
        reset_password_token: req.body.token,
        reset_password_expires: {
            $gt: Date.now()
        }
    }).exec(function(err, user) {
        if (!err && user) {
            if (req.body.newPassword === req.body.verifyPassword) {
                user.hash_password = bcrypt.hashSync(req.body.newPassword, 10);
                user.reset_password_token = undefined;
                user.reset_password_expires = undefined;
                user.save(function(err) {
                    if (err) {
                        return res.status(422).send({
                            message: err
                        });
                    } else {
                        var data = {
                            to: user.email,
                            from: email,
                            template: 'reset-password-email',
                            subject: 'Password Reset Confirmation',
                            context: {
                                name: user.fullName.split(' ')[0]
                            }
                        };

                        smtpTransport.sendMail(data, function(err) {
                            if (!err) {
                                return res.json({ message: 'Password reset' });
                            } else {
                                return done(err);
                            }
                        });
                    }
                });
            } else {
                return res.status(422).send({
                    message: 'Passwords do not match'
                });
            }
        } else {
            return res.status(400).send({
                message: 'Password reset token is invalid or has expired.'
            });
        }
    });
};