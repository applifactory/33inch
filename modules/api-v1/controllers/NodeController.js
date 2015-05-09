var authUtil = require('../../../utils/AuthService.js');
var User = require('../../../models/user');
var Website = require('../../../models/website');
var Node = require('../../../models/node');

module.exports.findWebsite = function(req, res, next) {
  Website.findOne({ permalink: req.params.link }).exec(function(err, website){
    if (err) return res.status(404).end();
    req.params.website = website;
    return next();
  });
}

module.exports.list = function(req, res) {
  Node.find( { parentWebsite: req.params.website._id }, 'name link nodes' ).populate('nodes').exec(function(err, nodes){
    if (err) return res.status(404).end();
    res.json({ nodes: nodes });
  });
}

module.exports.details = function(req, res) {
  Node.findById( req.params.website._id ).exec(function(err, node){
    if (err) return res.status(404).end();
    res.json({ node: node });
    res.status(401).end();
  });
}

module.exports.create = function(req, res) {
  var node = new Node();
  node.name = req.body.name;
  node.link = req.body.link;
  if ( req.body.parentNode )
    node.parentNode = req.body.parentNode;
  else
    node.parentWebsite = req.params.website._id;
  node.save(function(err, node){
    if (err) return res.status(401).end();
    res.json(node);
    console.log('added');
  });
}
