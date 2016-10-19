var authUtil = require('../../../utils/AuthService.js');
var extractObject = require('../../../utils/ExtractObject');
var User = require('../../../models/user');
var Website = require('../../../models/website');
var Share = require('../../../models/share');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../../../config/config.js');
var Mailgun = require('mailgun-js');
var nl2br  = require('nl2br');

module.exports.list = function(req, res) {
  Website.findOne({ owners: req.params.authUser._id, permalink: req.params.link }, function(err, website){
    if ( err || !website ) { return res.status(400).end(); }
    Share.find({ website: website._id }, function(err, shares){
      if ( err ) { return res.status(400).end(); }
      res.json(shares || []);
    });
  });
};
module.exports.add = function(req, res) {
  if ( req.body.email ) {
    Website.findOne({ owners: req.params.authUser._id, permalink: req.params.link }, function(err, website){
      if ( err || !website ) { return res.status(400).end(); }
      share = new Share();
      share.email = req.body.email;
      share.website = website._id;
      share.save(function(err) {
        if ( err ) {
          return res.status(400).json({ message: err }).end();
        }
        res.end();
      });
    });
  } else {
    return res.status(400).end();
  }
};

module.exports.delete = function(req, res) {
  Website.findOne({ owners: req.params.authUser._id, permalink: req.params.link }, function(err, website){
    if ( err || !website ) { return res.status(400).end(); }
    Share.remove({_id: req.params.id, website: website._id}, function(err) {
      if ( err ) {
        return res.status(400).json({ message: err }).end();
      }
      res.end();
    });
  });
};
