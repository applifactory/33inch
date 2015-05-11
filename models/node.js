var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");

//  schema
var NodeSchema = new Schema({
  name: String,
  link: { type: String, index: { unique: false } },
  nodes: [{ type: Schema.Types.ObjectId, ref: 'Node' }],
  parentNode: { type: Schema.Types.ObjectId, ref: 'Node', childPath: 'nodes' },
  parentWebsite: { type: Schema.Types.ObjectId, ref: 'Website', childPath: 'nodes' },
  elements: [{ type: Schema.Types.ObjectId, ref: 'Element' }],
  sortOrder: Number
});

//  relations
NodeSchema.plugin(relationship, { relationshipPathName: ['parentWebsite', 'parentNode'] });

//  model
var Node = mongoose.model('Node', NodeSchema);

//  validate permalink
Node.schema.path('link').validate(function (value) {
  return !value || /^([a-z0-9\-]+)$/g.test(value);
}, 'Invalid link format');

module.exports = Node;
