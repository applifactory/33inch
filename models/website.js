var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");
var User = require('./user.js');

//  schema
var WebsiteSchema = new Schema({
  name: String,
  public: { type: Boolean, default: false },
  permalink: { type: String, required: true, index: { unique: true } },
  domain: { type: String, required: true, index: { unique: true } },
  email: String,
  owners: [{ type: Schema.Types.ObjectId, ref: 'User', childPath: 'websites' }],
  nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
  images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
  elements: [{ type: Schema.Types.ObjectId, ref: 'Element' }],
  analytics: String,
  customScript: String
});

//  relations
WebsiteSchema.plugin(relationship, { relationshipPathName: 'owners' });

//  check domain uniqness
WebsiteSchema.pre("save", function(next, done) {
  var self = this;
  if ( !self.isModified('domain') )
    return next();
  if ( self.domain ) {
    mongoose.models["Website"].findOne({ domain: self.domain }, function(err, website) {
      if( err ) {
        next( err );
      } else if( website && website._id != self._id ) {
        self.invalidate("domain","Domain already taken");
        next( new Error("Domain already taken") );
      } else
        next();
    });
  } else
    next();
});

//  model
var Website = mongoose.model('Website', WebsiteSchema);

//  validate permalink
Website.schema.path('permalink').validate(function (value) {
  return /^([a-z0-9\-]+)$/g.test(value);
}, 'Invalid link format');

//  validate domain
Website.schema.path('domain').validate(function (value) {
  return /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/.test(value);
}, 'Invalid domain format');

//  validate email
Website.schema.path('email').validate(function (value) {
  return /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i.test(value);
}, 'Invalid email format');

module.exports = Website;

//  https://www.npmjs.com/package/mongo-relation
