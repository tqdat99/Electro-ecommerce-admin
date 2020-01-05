var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override')

var indexRouter = require('./routes/index');
var advertisementRouter = require('./routes/advertisements');
var userRouter = require('./routes/users');
var adminRouter = require('./routes/admins');
var typeRouter = require('./routes/types.js');
var productRouter = require('./routes/products');
var saleRouter = require('./routes/sales');
var orderRouter = require('./routes/orders');
//var top = require('./routes/top');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// app.use(bodyParser());
// app.use(express.session({ secret: 'anything' }));
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/admins', adminRouter);
app.use('/types', typeRouter);
app.use('/products', productRouter);
app.use('/advertisements', advertisementRouter);
app.use('/sales', saleRouter);
//app.use('/top', topRouter);
app.use('/orders', orderRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;