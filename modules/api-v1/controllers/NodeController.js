var authUtil = require('../../../utils/AuthService.js');
var normalize = require('../../../utils/NormalizeString.js');
var User = require('../../../models/user');
var Website = require('../../../models/website');
var Node = require('../../../models/node');
var Element = require('../../../models/element');

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
      Element.findByIdAndUpdate(_id, { $set: { menuOrder: _index }}, function (err, node) { });
    });
  res.end();
}

module.exports.getMenu = function(websiteId, callback) {
  Node
    .find( { parentWebsite: websiteId }, 'name link nodes elements sortOrder' )
    .populate('nodes', 'name link').sort('sortOrder')
    .populate({
      path: 'elements',
      select: 'menuLink menuTitle menuOrder',
      match: { menuLink: { $ne: null }},
      options: { sort: 'menuOrder' }
    })
    .exec(function(err, nodes){
      if (err) {
        return callback(err);
      }
      var elements = [];
      nodes.forEach(function(node, index){
        node = node.toObject();
        node.elements.forEach(function(element){
          elements.push({
            _id: element._id,
            name: element.menuTitle,
            link: node.link,
            softLink: element.menuLink,
            sortOrder: element.menuOrder
          });
        })
        delete node.elements;
        delete node.nodes;
        nodes[index] = node;
      })
      nodes = nodes.concat(elements);

      Element.find({
        parentWebsite: websiteId,
        menuLink: { $ne: null }
      }, 'menuLink menuTitle menuOrder', function(err, elements){
        elements.forEach(function(element){
          nodes.push({
            _id: element._id,
            name: element.menuTitle,
            softLink: element.menuLink,
            sortOrder: element.menuOrder
          })
        })

        nodes.sort(function(a,b) {
          return a.sortOrder > b.sortOrder ? 1 : -1
        });

        callback(false, nodes);

      })
    });
}

module.exports.list = function(req, res) {

  module.exports.getMenu(req.params.website._id, function(err, nodes){
    if (err) return res.status(404).end();
    res.json(nodes);
  });


}

module.exports.details = function(req, res) {
  req.params.website.populate('elements', 'template data', function(err, website){
    Node.findOne({ _id: req.params.nodeId }, 'link name elements').populate('elements', 'template data menuTitle menuLink', null, { sort: { sortOrder: 1 } } ).exec(function(err, node){
      if (err || !node) return res.status(404).end();
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
  node.link = normalize(req.body.name).replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
  if ( req.body.parentNode )
    node.parentNode = req.body.parentNode;
  else
    node.parentWebsite = req.params.website._id;
  node.save(function(err, node){
    if (err) return res.status(400).end();
    res.json(node);
  });
}

module.exports.update = function(req, res) {
  console.log('update', req.params, req.body);
  Node.findOne({ _id: req.params.nodeId }).exec(function(err, node){
    if (err) return res.status(404).end();
    if ( req.body.name ) {
      node.name = req.body.name;
      if ( node.link != '' )
        node.link = normalize(req.body.name).replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
    }
    if ( req.body.hasOwnProperty('link') )
      node.link = req.body.link;
    node.save(function(err){
      if (err) return res.status(400).end();
      res.end();
    });
  });
}

module.exports.delete = function(req, res) {
  Node.findOne({ _id: req.params.nodeId }).exec(function(err, node){
    if (err) return res.status(404).end();
    node.remove(function(){
      res.end();
    });
  });
}
