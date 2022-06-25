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
const uploadRouter = require('./routes/uploadRouter');
const feedbackRouter = require('./routes/feedbackRouter');
const commentRouter = require('./routes/commentRouter');
const chefsRouter = require('./routes/chefsRouter');
const favoritesRouter = require('./routes/favoritesRouter');
const db = require('./models');

db.sequelize.authenticate()
.then(() => {
  db.sequelize.sync();
  console.log('Synced')
})
.catch(err => console.log(err)); 

var app = express();

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Content-Type', 'application/json; charset=utf-8')
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
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


// const auth = (req, res, next) => {

//   console.log('req.user: ',req.user);
//   if(!req.user) {
//       let err = new Error('You are not authenticated!');
//       err.status = 403;
//       return next(err);
//   }
//   else {
//       next();
//   }
// }

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
//app.use(auth);
app.use('/users', userRouter);
app.use('/dishes', dishRouter);
app.use('/imageUpload', uploadRouter);

app.use('/feedback', feedbackRouter);
app.use('/comments', commentRouter);
app.use('/chefs', chefsRouter);
app.use('/favorites', favoritesRouter);

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
