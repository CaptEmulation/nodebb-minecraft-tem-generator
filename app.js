'use strict';

//dependencies
var express = require('express'),
    session = require('express-session'),
    http = require('http'),
    path = require('path'),
    config = require('./config');



//create express app
var app = express();

// Save the config
app.config = config;

//setup the web server
app.server = http.createServer(app);

//config data models

//settings
app.disable('x-powered-by');
app.set('port', config.port);
app.set('views', path.join(__dirname, 'private'));
app.set('view engine', 'jade');

//middleware
//app.use(require('compression')());
app.use(require('serve-static')(path.join(__dirname, 'public')));
app.use(require('body-parser')());
//app.use(require('method-override')());
//app.use(require('cookie-parser')());

//response locals
app.use(function(req, res, next) {
  res.locals.user = {};
  res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
  res.locals.user.username = req.user && req.user.username;
  next();
});

//global locals
//app.locals.projectName = app.config.projectName;
app.locals.copyrightYear = new Date().getFullYear();
//app.locals.copyrightName = app.config.companyName;
app.locals.cacheBreaker = 'br34k-01';

//custom (friendly) error handler
//app.use(require('./views/http/index').http500);

app.get('/widget/item/?', require('./private/widget/item/index')(app).init);

// Drastic error reporting
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err + "\n" + err.stack);
});

//listen up
app.server.listen(app.config.port, function(){
  //and... we're live
});
