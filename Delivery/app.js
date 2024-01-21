var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressSession=require("express-session");
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressSession({
  resave: false, 
  saveUninitialized: false,
  secret: "hello hello"
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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











// notification
// Sample data to simulate seller and customer profiles
let sellerNotifications = [];
let customerNotifications = [];

// Seller profile route
app.get('/profile1', (req, res) => {
    res.render('profile1', { notifications: sellerNotifications });
});

app.post('/notify-seller', (req, res) => {
    const message = 'Your order is out for delivery';
    sellerNotifications.push(message);
    res.redirect('/profile1');
});

// Customer profile route
app.get('/profile2', (req, res) => {
    res.render('profile2', { notifications: customerNotifications });
});

app.post('/notify-customer', (req, res) => {
    const message = 'I am ready to receive goods';
    customerNotifications.push(message);
    res.redirect('/profile2');
});


module.exports = app;
