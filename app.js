var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var routes       = require('./app/routes/index');
var User         = require('./app/model/user');
var users        = require('./app/routes/users');
var webhooks     = require('./app/routes/webhooks');
var apiController = require('./app/controller/api');
var mongoose     = require('mongoose');
var schedule     = require('node-schedule');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

// mongoose.connect('mongodb://localhost/test');
mongoose.connect('mongodb://root:admin@ds031915.mlab.com:31915/horoscope-oracle');
// mongoose.connect('mongodb://root:admin@ds031915.mblab.com:31915/horoscope-oracle');

var j = schedule.scheduleJob('20 * * * * *', function(){
  User.find({}, function(err, users ) {
    if( users != null) {
      users.forEach(function(user){
        apiController.sendDailyHoroscope( user.fb_id, user.user_sign );
      });
    }
  });
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app/public')));

app.use('/', routes);
// app.use('/users', users);
app.use('/userlist', users);
app.use('/webhook', webhooks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
