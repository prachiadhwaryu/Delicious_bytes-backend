var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var usersRouter = require('./routes/users.routes');
var recipeRouter = require('./routes/recipes.routes');
var listRouter = require('./routes/lists.routes');
var homePageRouter = require('./routes/homePage.routes');
const connectToDatabase = require('./config/connection');

var app = express();
app.use(cors())

connectToDatabase();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Routers
app.use('/users', usersRouter);
app.use('/home', homePageRouter);
app.use('/recipes', recipeRouter);
app.use('/lists', listRouter);
app.use('/images', express.static(__dirname + '/uploads/images'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
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


module.exports = app ;
