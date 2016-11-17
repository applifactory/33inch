var config = require('../config/config.js'),
    Website = require('../models/website.js'),
    fs = require('fs');

//  serve website
function serveWebsite(req, res, next, website) {

  var websitePath = 'build/' + website.permalink;
  if ( !fs.existsSync(websitePath) )
    return next();

  if ( req.params[0] == '/' || req.params[0].indexOf('.html') > 0 || req.params[0].indexOf('/assets') === 0 ) {
    var file = req.params[0] == '/' ? '/index.html' : req.params[0];
    if ( ['/assets/inch33.min.css', '/assets/inch33.js'].indexOf(file) >= 0 ) {
      return next();
    }
    if ( fs.existsSync(websitePath + file) ) {
      return res.sendFile(file, {root: websitePath});
    }

    //  show placeholder if possible
    file = file.replace(/^.*\//, '');
    if ( fs.existsSync('assets/img/placeholder/' + file) ) {
      return res.sendFile(file, {root: 'assets/img/placeholder'});
    }
  }
  next();
}

//  middleman for subdomain/vhost routes
module.exports = function(app) {

  //  check domain/subdomain route
  app.route('*').all(function(req, res, next) {

    var domain = config.domain.replace(/:.*/, '');

    //  mateusz.im static website routing
    if ( req.hostname.indexOf('mateusz.im') >= 0 ) {
      var file = req.params[0] == '/' ? '/index.html' : req.params[0];
      return res.sendFile(file, {root: 'build/mateusz.im'});
    }

    //  quick check
    if ( domain == req.hostname.replace(/^www./, '') ) {
      return next();
    }

    if ( req.hostname.indexOf(domain) > 0 ) {
      //  check subdomain
      var subdomain = req.hostname.replace(/\..*/, '');
      Website.findOne({ permalink: subdomain }, function(err, website){
        if ( err || !website )  return next();
        serveWebsite(req, res, next, website);
      });
    } else {
      //  check domain
      Website.findOne({ domain: req.hostname.replace(/^www./, '').replace(/:.*/, '') }, function(err, website){
        if ( err || !website )  return next();
        serveWebsite(req, res, next, website);
      });
    }

  });

};
