var authUtil = require('../../../utils/AuthService.js');
var User = require('../../../models/user');
var Website = require('../../../models/website');
var Node = require('../../../models/node');
var WebsiteExport = require('../../../utils/WebsiteExportService');

module.exports.index = function(req, res) {
  res.json(req.params.authUser.websites);
};

module.exports.details = function(req, res) {
  Website
    .findOne({ permalink: req.params.link }, 'name permalink')
    .exec(function(err, website){
      if (err || !website) return res.status(404).end();
      res.json(website);
    });
};

module.exports.create = function(req, res) {
  if ( req.body.name ) {
    var userId = req.params.authUser._id;
    var website = new Website();
    website.name = req.body.name;
    website.permalink = ( req.body.permalink ? req.body.permalink.toLowerCase() : website.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase() );
    if ( req.body.domain )  website.domain = req.body.domain;
    website.owners.push(req.params.authUser);
    website.save(function(error){
      if ( error ) {
        console.log('website save error', error);
        var errMessage = 'Unknown error';
        if ( error.code == 11000 ) {
          if ( error.err.indexOf('permalink') > 0 )
            errMessage = 'Link already taken';
        } else if ( error.message ) {
          errMessage = error.message;
        }
        if ( error.errors ) {
          if ( error.errors.hasOwnProperty('domain') )
            errMessage = error.errors.domain.message;
          if ( error.errors.hasOwnProperty('permalink') )
            errMessage = error.errors.permalink.message;
        }
        res.status(400).json({message: errMessage});
      } else {
        var node = new Node();
        node.name = 'Home';
        node.link = '';
        node.parentWebsite = website._id;
        node.save(function(err){
          if (err) return res.status(400).end();
        });
        res.json({message: 'Website created'});
      }
    });
  } else
    res.status(400);
}

module.exports.export = function(req, res) {
  Website
    .findOne({ permalink: req.params.link })
    .populate('elements')
    .populate('nodes')
    .exec(function(err, website){
      if (err) return res.status(404).end();
      WebsiteExport.export(website, function(err, result){
        if (err) return res.json({message: err}).status(400).end();
        res.json(result);
      })
    });
};

module.exports.update = function(req, res) {
  Website.findOne({ permalink: req.params.link }).exec(function(err, website){
    if (err) return res.status(404).end();
    if ( req.body.domain )
      website.domain = req.body.domain;
    website.save(function(err){
      if (err) return res.status(400).end();
      res.end();
    });
  });
}
