const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Global Variables
global.APP_VERSION = '1.0.0'
global.APP_PATH = __dirname;
global.md5 = require('md5');
global.async = require('async');
global.fs = require('fs');
global.path = require('path');


// Router Files
const indexRouter = require('./routes/index');
const photoRouter = require('./routes/photos');

// Initial App Express
const app = express();

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Other initialization
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Router
app.use('/', indexRouter);
app.use('/photos', photoRouter);

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
