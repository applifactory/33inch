var express         = require('express'); // call express
var app             = express(); // define our app using express
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var rollbar         = require('rollbar');
var mongoose        = require('mongoose'); // for working w/ our database
var port            = process.env.PORT || 3000; // set the port for pur app
var fs              = require('fs');
var config          = require('./config/config.js');
var websitesService = require('./utils/WebsitesService.js');
var https           = require('https');

//  Startup
app.settings.env = process.env.ENV || 'development';
console.log('ENV: ' + app.settings.env );

//  Logger
app.use(morgan('dev'));

//  Rollbar error handler
if ( ['production', 'staging'].includes(app.settings.env) ) {
  app.use(rollbar.errorHandler('73bf51c39ac6480dac24fe654b025311', { environment: app.settings.env }));
}

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
websitesService(app);

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

//  SSL support for production only
if ( app.settings.env == 'production' ) {
  var server = https.createServer(
    {
      key: fs.readFileSync('./tls/key.pem'),
      cert: fs.readFileSync('./tls/cert.pem')
    },
    app
  )
  server.listen(443);
}

//  Run server
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
