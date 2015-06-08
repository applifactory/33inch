var authUtil = require('../../../utils/AuthService.js');
var User = require('../../../models/user');
var Website = require('../../../models/website');
var Node = require('../../../models/node');
var WebsiteExport = require('../../../utils/WebsiteExportService');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../../../config/config.js');

module.exports.index = function(req, res) {
  res.json(req.params.authUser.websites);
};

module.exports.details = function(req, res) {
  Website
    .findOne({ permalink: req.params.link }, 'name permalink email')
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
      var websiteExport = new WebsiteExport();
      websiteExport.export(website, function(err, result){
        if (err) return res.json({message: err}).status(400).end();
        res.json({message: 'Export success'});
      });
    });
};

module.exports.update = function(req, res) {
  Website.findOne({ permalink: req.params.link }).exec(function(err, website){
    if (err) return res.status(404).end();
    if ( req.body.domain && website.domain != req.body.domain )
      website.domain = req.body.domain;
    if ( req.body.email && website.email != req.body.email )
      website.email = req.body.email;
    website.save(function(err){
      if (err) {
        var errorMsg = err.message;
        if ( err.name == 'ValidationError' ) {
          if ( err.errors.domain )
            errorMsg = err.errors.domain.message;
          if ( err.errors.email )
            errorMsg = err.errors.email.message;
        }
        return res.status(400).json({ message: errorMsg }).end();
      }
      res.end();
    });
  });
}

module.exports.sendMail = function(req, res) {

  if ( config.domain == req.hostname )
    return res.status(404).end();
  if ( req.hostname.indexOf(config.domain) > 0 )
    query = { permalink: req.hostname.replace('.' + config.domain, '') };
  else
    query = { domain: req.hostname };

  Website
    .findOne(query)
    .exec(function(err, website){
      if (err || !website) return res.status(404).end();
      if ( !website.email ) return res.status(400).json({message: 'Email messages not allowed'}).end();
      if ( !req.body.email ) return res.status(400).json({message: 'Sender not set'}).end();
      var title = 'Message from ' + (website.domain ? website.domain : website.permalink);
      var message = '';
      for ( var attr in req.body ) {
        message += ( attr == 'email' ? 'Sender' : attr ) + ': ' + req.body[attr] + "\n";
      }
      var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'mateusz.witalinski@gmail.com', pass: 'Mateush16' } });
      transporter.sendMail({
        from: 'mateusz.witalinski@33inch.com',
        replyTo: req.body['email'],
        to: website.email,
        subject: title,
        text: message
      }, function(err, info){
        if ( err )  {
          console.error('Send mail error', err);
          res.status(400).json(err).end();
        } else {
          console.log('Success', info);
          res.end();
        }
      });
    });
}
