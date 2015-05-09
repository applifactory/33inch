var authUtil = require('../../../utils/AuthService.js');
var User = require('../../../models/user');
var Website = require('../../../models/website');
var Node = require('../../../models/node');

module.exports.index = function(req, res) {
  res.json(req.params.authUser.websites);
};

module.exports.details = function(req, res) {
  Website
    .findOne({ permalink: req.params.link })
    .populate('nodes')
    .exec(function(err, website){
      if (err) return res.status(401).end();
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
          if (err) return res.status(401).end();
        });
        res.json({message: 'Website created'});
      }
    });
  } else
    res.status(400);
}
