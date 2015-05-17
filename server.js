var express         = require('express'); // call express
var app             = express(); // define our app using express
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var mongoose        = require('mongoose'); // for working w/ our database
var port            = process.env.PORT || 3000; // set the port for pur app
var fs              = require('fs');
var config          = require('./config/config.js');
var websitesService = require('./utils/WebsitesService.js');

//  Startup
console.log('ENV: ' + ( process.env.ENV || 'development' ) );
app.settings.env = process.env.ENV || 'development';

//  Logger
app.use(morgan('dev'));

//  Database
mongoose.connect(config.db);

//  Views
app.set('views', __dirname + '/modules');
app.set('view engine', 'jade');

//  Request params parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//  CORS
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, X-Auth-Token');
  next();
});

//  Static exported websites
//websitesService(app);

//  Assets
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/assets/img'));
app.use(express.static(__dirname + '/assets/font'));

//  Modules with its routes and controllers
fs.readdirSync('./modules').forEach(function (moduleName) {
  if ( fs.existsSync('./modules/' + moduleName + '/routes') ) {
    fs.readdirSync('./modules/' + moduleName + '/routes').forEach(function (routeName) {
      if(routeName.substr(-3) == '.js') {
        var route = require('./modules/' + moduleName + '/routes/' + routeName);
        route(app);
      }
    });
  }
});

app.listen(config.port);
console.log('Magic happens on port ' + config.port);

