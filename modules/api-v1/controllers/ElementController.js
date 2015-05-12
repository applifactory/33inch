var authUtil = require('../../../utils/AuthService.js');
var Website = require('../../../models/website');
var Element = require('../../../models/element');
var Image = require('../../../models/image');
var merge = require('merge-util');
var ImageUtil = require('../../../utils/ImageService.js');
var multiparty = require('multiparty');

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
    element.parentWebsite = req.params.website._id;
  else
    element.parentNode = req.params.nodeId;
  element.template = req.body.template;
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

module.exports.uploadImage = function(req, res) {
  console.log('upload');
  Element.findById(req.params.elementId, function (err, element) {
    if ( err ) return res.status(404).end();
    console.log('got element');
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      if ( err ) return res.status(400).end();
      console.log('got file');
      var file = files.file[0];
      ImageUtil.processImage(file, function(fileName){
        console.log('processed');
        var image = new Image();
        image.filename = fileName;
        image.parentElement = req.params.elementId;
        image.parentWebsite = req.params.website._id;
        image.save();
        res.json({ file: fileName });
      })
    });
  });
}

module.exports.deleteImage = function(req, res) {
  Image.findOne({
    filename: req.params.image,
    parentElement: req.params.elementId
  }, function(err, image){
    if ( err || !image ) return res.status(404).end();
    image.remove();
    ImageUtil.deleteImage(req.params.image, function(fileName){
      res.end();
    });
  });
}

module.exports.updatePositions = function(req, res) {
  console.log('updatePositions', req.body.ids);
  var ids = req.body.ids;
  if ( ids )
    ids.forEach(function(_id, _index){
      Element.findByIdAndUpdate(_id, { $set: { sortOrder: _index }}, function (err, element) { });
    });
  res.end();
}

module.exports.delete = function(req, res) {
  Element.findById(req.params.elementId, function(err, element){
    if ( err || !element )  res.status(404).end();
    element.remove();
    res.end();
  });
}
