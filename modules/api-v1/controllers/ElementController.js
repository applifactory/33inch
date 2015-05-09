var authUtil = require('../../../utils/AuthService.js');
var Website = require('../../../models/website');
var Element = require('../../../models/element');
var merge = require('merge-util');

module.exports.findWebsite = function(req, res, next) {
  Website.findOne({ permalink: req.params.link }).exec(function(err, website){
    if (err) return res.status(404).end();
    req.params.website = website;
    return next();
  });
}

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

module.exports.update = function(req, res) {
  Element.findById(req.params.elementId, function (err, element) {
    if (err || !element) return res.status(404).end();
    if ( !element.data )
      element.data = req.body.data;
    else
      element.data = merge(element.data, req.body.data);
    element.markModified('data');
    element.save(function(err){
      if(err) return res.status(400).end();
      res.end();
    })
  });
}
