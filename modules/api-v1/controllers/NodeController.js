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

module.exports.updatePositions = function(req, res) {
  var ids = req.body.ids;
  if ( ids )
    ids.forEach(function(_id, _index){
      Node.findByIdAndUpdate(_id, { $set: { sortOrder: _index }}, function (err, node) { });
    });
  res.end();
}


module.exports.list = function(req, res) {
  Node.find( { parentWebsite: req.params.website._id }, 'name link nodes' ).populate('nodes', 'name link').sort('sortOrder').exec(function(err, nodes){
    if (err) return res.status(404).end();
    res.json(nodes);
  });
}

module.exports.details = function(req, res) {
  req.params.website.populate('elements', 'template data', function(err, website){
    Node.findOne({ _id: req.params.nodeId }, 'link name elements').populate('elements', 'template data').exec(function(err, node){
      if (err) return res.status(404).end();
      res.json({
        _id: node._id,
        name: node.name,
        baseElements: website.elements,
        elements: node.elements
      });
    });
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
    if (err) return res.status(400).end();
    res.json(node);
  });
}
