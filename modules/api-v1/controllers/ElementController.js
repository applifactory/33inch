var authUtil = require('../../../utils/AuthService.js');
var Website = require('../../../models/website');
var Element = require('../../../models/element');

module.exports.findWebsite = function(req, res, next) {
  Website.findOne({ permalink: req.params.link }).exec(function(err, website){
    if (err) return res.status(404).end();
    req.params.website = website;
    return next();
  });
}

//module.exports.list = function(req, res) {
//  Node.find( { parentWebsite: req.params.website._id }, 'name link nodes' ).populate('nodes').exec(function(err, nodes){
//    if (err) return res.status(404).end();
//    res.json({ nodes: nodes });
//  });
//}

//module.exports.details = function(req, res) {
//  Node.findById( req.params.website._id ).exec(function(err, node){
//    if (err) return res.status(404).end();
//    res.json({ node: node });
//    res.status(401).end();
//  });
//}

module.exports.create = function(req, res) {
  var element = new Element();
  if ( !req.body.template )
    return res.status(400).json({ message: 'Template parameter missing' }).end();
  if ( !req.params.nodeId )
    return res.status(400).json({ message: 'Parent nodeId parameter missing' }).end();
  element.template = req.body.template;
  element.parentNode = req.params.nodeId;
  if ( req.body.data ) {
    element.data = req.body.data;
    element.markModified('data');
  }
  element.save(function(err, element){
    if (err) return res.status(400).end();
    res.json(element);
  });
}
