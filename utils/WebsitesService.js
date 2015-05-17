'use strict';

var config = require('../config/config.js');
var Website = require('../models/website.js');

//  serve website
function serveWebsite(req, res, website) {


  //var uid = req.params.uid,
  //path = req.params[0] ? req.params[0] : 'index.html';
  //res.sendfile(path, {root: './public'});

  console.log(req.params);

  console.log('serveWebsite ', website.name);
  return res.send('hello from ', website.name).end();
}

//  middleman for subdomain/vhost routes
module.exports = function(app) {

  //  check domain/subdomain route
  app.route('*').all(function(req, res, next) {

    //  quick check
    if ( config.domain == req.hostname )
      return next();

    if ( req.hostname.indexOf(config.domain) > 0 ) {
      //  check subdomain
      var subdomain = req.hostname.replace('.' + config.domain, '');
      Website.findOne({ permalink: subdomain }, function(err, website){
        if ( err || !website )  return next();
        serveWebsite(req, res, website);
      });
    } else {
      //  check domain
      Website.findOne({ domain: req.hostname }, function(err, website){
        if ( err || !website )  return next();
        serveWebsite(req, res, website);
      });
    }

  });

};
