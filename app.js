var express = require('express');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var routes = require('./routes');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

mongoose.connect('mongodb://localhost/linguine-' + app.settings.env);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.LINGUINE_SESSION_SECRET || 'SESSION_SECRET',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

routes(app);
app.use(function(req, res, next) {
  res.render('index');
});


app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: err.status || 500
  });
});

module.exports = app;
