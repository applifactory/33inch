var authUtil = require('../../../utils/AuthService.js');
var extractObject = require('../../../utils/ExtractObject');
var User = require('../../../models/user');
var Website = require('../../../models/website');
var Node = require('../../../models/node');
var WebsiteExport = require('../../../utils/WebsiteExportService');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../../../config/config.js');
var Mailgun = require('mailgun-js');
var nl2br  = require('nl2br');
var webshot = require('webshot');

module.exports.index = function(req, res) {
  Website.find({ owners: req.params.authUser._id }, function(err, websites){
    if ( err ) {
      if (err) return res.status(400).end();
    }
    res.json(websites);
  });
};

module.exports.details = function(req, res) {
  Website
    .findOne({ owners: req.params.authUser._id, permalink: req.params.link }, 'name permalink email public domain analytics customScript lastExport lastChanges')
    .exec(function(err, website){
      if (err || !website) return res.status(404).end();
      res.json(website);
    });
};

function takeScreenshot(link, callback) {
  var previewUrl = 'http://' + link + '.' + config.domain + '/?preview',
      previewPath = './build/' + link + '/preview.jpg',
      options = {
        screenSize: {
          width: 1280,
          height: 900
        }, shotSize: {
          width: 1280,
          height: 900
        },
        defaultWhiteBackground: true
      };
  webshot(previewUrl, previewPath, options, function(err) {
    callback();
  });
}

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
};

module.exports.export = function(req, res) {
  Website
    .findOne({ owners: req.params.authUser._id, permalink: req.params.link })
    .populate('elements')
    .populate('nodes')
    .exec(function(err, website){
      if ( req.body.domain ) {
        website.domain = req.body.domain;
        website.save();
      }
      if (err) return res.status(404).end();
      var websiteExport = new WebsiteExport();
      websiteExport.export(website, function(err, result){
        if (err) {
          return res.status(400).json({message: err}).end();
        }
        Website.update({ owners: req.params.authUser._id, permalink: req.params.link }, { $set: { lastExport: new Date() } }, function(err) {
          takeScreenshot(req.params.link, function(){
            res.json({message: 'Export success'});
          });
        });
      });
    });
};

module.exports.update = function(req, res) {

  var update = extractObject(req.body, [
    'name',
    'public',
    'permalink',
    'domain',
    'email',
    'analytics',
    'customScript'
  ]);

  Website.update({ permalink: req.params.link }, update, function(err) {
    if ( err ) {
      if ( err.code == 11000 ) {
        if ( err.message.indexOf('index: domain') > 0 ) {
          return res.status(400).json({ message: 'Domain "' + update.domain + '" is already in use' }).end();
        } else {
          return res.status(400).json({ message: 'Permalink "' + update.permalink + '" is already in use' }).end();
        }
      }
      return res.status(400).json({ message: err }).end();
    }
    res.end();
  });

};

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
        message += '<strong>' + ( attr == 'email' ? 'Sender' : attr ) + '</strong>: <br />' + nl2br(req.body[attr]) + "<br /><br />";
      }

      var mailgun = new Mailgun( config.mailgun );

      var data = {
        from: req.body.email,
        to: website.email,
        subject: title,
        html: message
      };

      mailgun.messages().send(data, function (err, body) {
        if ( err )  {
          console.error('Send mail error', err);
          res.status(400).json(err).end();
        } else {
          console.log('Success', body);
          res.end();
        }
      });

    });
};
