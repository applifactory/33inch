var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");

//  schema
var ElementSchema = new Schema({
  template: String,
  data: { type: Schema.Types.Mixed },
  parentNode: { type: Schema.Types.ObjectId, ref: 'Node', childPath: 'elements' },
  parentWebsite: { type: Schema.Types.ObjectId, ref: 'Website', childPath: 'elements' },
  images: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
  files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
  sortOrder: Number,
  menuLink: String,
  menuTitle: String,
  menuOrder: { type: Number, default: 1000 }
});

//  relations
ElementSchema.plugin(relationship, { relationshipPathName: ['parentNode', 'parentWebsite'] });

//  model
var Element = mongoose.model('Element', ElementSchema);

//  validate template name
Element.schema.path('template').validate(function (value) {
  return !value || /^([a-z0-9\-]+)$/g.test(value);
}, 'Invalid template name format');

module.exports = Element;
