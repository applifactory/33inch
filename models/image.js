var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");

//  schema
var ImageSchema = new Schema({
  filename: String,
  parentElement: { type: Schema.Types.ObjectId, ref: 'Element', childPath: 'images' },
  parentWebsite: { type: Schema.Types.ObjectId, ref: 'Website', childPath: 'images' }
});

//  relations
ImageSchema.plugin(relationship, { relationshipPathName: ['parentElement', 'parentWebsite'] });

module.exports = mongoose.model('Image', ImageSchema);
