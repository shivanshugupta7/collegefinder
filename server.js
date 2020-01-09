var express = require("express");                 // using express library
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var engine = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var secret = require('./config/secret');
var MongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');
var addcollege = require('./models/addcollege');
var collegereviews = require('./models/collegereviews');
var us = require('./models/user');
var passport = require('passport');
var expressValidator = require('express-validator');


var app = express(); // Express Object

mongoose.connect(secret.database,{useNewUrlParser:true },function(err) {
  if(err) {
    console.log(err);
  }
  else{
    console.log("Connected to the db");
  }
});


//Middleware
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());

//app.use(expressSession({ secret: 'max' , saveUninitialized: false , resave: false}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({ url: secret.database,autoReconnect: true}),
  useUnifiedTopology: true


}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req,res,next) {
  res.locals.user = req.user;
  next();
});

app.use(function(req,res,next) {
  res.locals.ad= req.ad;
  next();

});

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.use(function(req,res,next) {
  collegereviews.find({},function(err,colg) {
    if(err) return next(err);
    res.locals.colg=colg;
    next();
  });
});

app.use(function (req, res, next) {
  us.find({}, function (err,u) {
    if (err) return next(err);
    res.locals.u = u;
    next();
  });
});


app.use(function (req, res, next) {
  addcollege.find({}, function (err, college) {
    if (err) return next(err);
    res.locals.college = college;
    next();
  });
});

var creviews = new collegereviews();
app.use(function (req, res, next) {
    
    res.locals.creviews = creviews;
    next();
});

app.engine('ejs',engine);
app.set('view engine','ejs');



var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');

app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);



app.listen(secret.port, function (err) {
  if(err) throw err;                    // Call back if this shows error
  console.log("Server is running on port "+secret.port);
});
