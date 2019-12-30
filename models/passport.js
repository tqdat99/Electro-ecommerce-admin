const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var database = require('./database')
var pool = database.pool

function initialize(passport) {
    const authenticateUser = async(username, password, done) => {
        query = 'select * from "Users" where username = \'' + username + '\''
        pool.query(query, async(err, res) => {
            user = null
            if (res.rows.length > 0)
                user = res.rows[0]
            if (user == null) {
                console.log('Tên tài khoản không tồn tại')
                return done(null, false, { message: 'Tên tài khoản không tồn tại' });
            } else {
                try {
                    if (user.status == 'locked') {
                        console.log('Account locked')
                        return done(null, false, { message: 'Tài khoản đã bị khóa' });
                    }
                    if (await bcrypt.compare(password, user.password)) {
                        console.log('OK')
                        return done(null, user);
                    } else {
                        console.log('Mật khẩu không đúng')
                        return done(null, false, { message: 'Mật khẩu không đúng' });
                    }
                } catch (e) {
                    return done(e);
                }
            }
        })
    }
    passport.use(new LocalStrategy({
        usernameField: 'username'
    }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        return done(null, user);
    });

}

module.exports = initialize;