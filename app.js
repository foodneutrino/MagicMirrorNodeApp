var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var magicMirror = require('./magicMirror');
var Timer = require('./test_timer')
var io = require('socket.io')(4000);

var routes = require(__dirname+'/routes/index');
var app = express();

// Setup AWS IoT
magicMirror.setup();

// Setup time update
var timer = new Timer()

// Listener for IoT event
// Let's broadcast via Socket.io
magicMirror.onMessage(function(topic,payload){
    var state = {topic:topic,state:payload};
    console.log("Magic Mirror Msg [" +
      JSON.stringify(state) +
      "] sending over port [4000]");
    io.emit('showme',state);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

module.exports = app;
