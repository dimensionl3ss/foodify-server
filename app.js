var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Sequelize = require('sequelize');
const config = require('./config/config')
const session = require('express-session');

const passport = require('passport');
const authenticate = require('./authentication');
//store session-info in local project-directory
const FileStore = require('session-file-store')(session);


var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
const dishRouter = require('./routes/dishesRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore({logFn: function(){}})
}));


const auth = (req, res, next) => {

  console.log('req.user: ',req.user);
  if(!req.user) {
      let err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
  }
  else {
      next();
  }
}

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', userRouter);

//app.use(auth);

app.use('/dishes', dishRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
