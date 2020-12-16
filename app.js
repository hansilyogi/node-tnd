var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var personRouter = require('./routes/personal_info');
var loginRouter = require('./routes/login');
var registrationRouter = require('./routes/registration');
var adminRouter = require('./routes/admin');
var directoryRouter = require('./routes/directoryList');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.urlencoded())

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/registration',registrationRouter);
app.use('/users', usersRouter);
app.use('/api/person', personRouter);
app.use('/api/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/directory', directoryRouter);
app.use("/uploads", express.static(__dirname + "/uploads"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//database
// MongoClient.connect('mongodb://localhost:27017/registration_db',function(err,db){
//   if(err) throw err;
//   var dbo = db.db('registration_db');
//   var collection = dbo.collection('user');
//   console.log("Connect............!!!!!!!!!!!")
//   app.locals.collection = collection; 
// });

mongoose.connect('mongodb+srv://root:root@cluster0.s73xs.mongodb.net/test',{
  useNewUrlParser : true,
  useUnifiedTopology : true,
  useFindAndModify: false,
  useCreateIndex: true, 
});
// mongoose.set('useCreateIndex', true);
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

module.exports = app;
