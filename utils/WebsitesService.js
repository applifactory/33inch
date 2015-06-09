'use strict';

var config = require('../config/config.js');
var Website = require('../models/website.js');
var fs = require('fs');

//  serve website
function serveWebsite(req, res, next, website) {

  var websitePath = 'build/' + website.permalink;
  if ( !fs.existsSync(websitePath) )
    return next();

  if ( req.params[0] == '/' || req.params[0].indexOf('.html') > 0 || req.params[0].indexOf('/assets') == 0 ) {
    var file = req.params[0] == '/' ? '/index.html' : req.params[0];
    return res.sendFile(file, {root: websitePath});
  }
  next();
}

//  middleman for subdomain/vhost routes
module.exports = function(app) {

  //  check domain/subdomain route
  app.route('*').all(function(req, res, next) {

    //  quick check
    if ( config.domain == req.hostname.replace(/^www./, '') )
      return next();

    if ( req.hostname.indexOf(config.domain) > 0 ) {
      //  check subdomain
      var subdomain = req.hostname.replace('.' + config.domain, '');
      Website.findOne({ permalink: subdomain }, function(err, website){
        if ( err || !website )  return next();
        serveWebsite(req, res, next, website);
      });
    } else {
      //  check domain
      Website.findOne({ domain: req.hostname.replace(/^www./, '') }, function(err, website){
        if ( err || !website )  return next();
        serveWebsite(req, res, next, website);
      });
    }

  });

};
