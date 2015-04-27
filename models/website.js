var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//  schema
var WebsiteSchema = new Schema({
  name: String,
  permalink: { type: String, required: true, index: { unique: true } },
  domain: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

//  check domain uniqness
WebsiteSchema.pre("save", function(next, done) {
  var self = this;
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
  return /^[a-z0-9\-]+$/g.test(value);
}, 'Invalid link format');

//  validate domain
Website.schema.path('domain').validate(function (value) {
  return /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/.test(value);
}, 'Invalid domain format');

module.exports = Website;

//  https://www.npmjs.com/package/mongo-relation
