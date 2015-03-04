var express         = require('express'); // call express
var app             = express(); // define our app using express
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var mongoose        = require('mongoose'); // for working w/ our database
var port            = process.env.PORT || 3000; // set the port for pur app
var fs              = require('fs');
var config          = require('./config/config.js');

//  Startup
console.log('NODE_ENV = ' + ( process.env.ENV || 'development' ) );

//  Logger
app.use(morgan('dev'));

//  Database
mongoose.connect('mongodb://localhost/test_db');

//  Views
app.set('views', __dirname + '/modules');
app.set('view engine', 'jade');

//  Assets
app.use(express.static(__dirname + '/public'));

//  Request params parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

fs.readdirSync('./modules').forEach(function (moduleName) {
  fs.readdirSync('./modules/' + moduleName + '/controllers').forEach(function (controllerName) {
    if(controllerName.substr(-3) == '.js') {
      route = require('./modules/' + moduleName + '/controllers/' + controllerName);
      if ( route.controller )
        route.controller(app);
    }
  });
});

app.listen(config.port);
console.log('Magic happens on port ' + config.port);

