var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");

//  schema
var FileSchema = new Schema({
  filename: String,
  parentElement: { type: Schema.Types.ObjectId, ref: 'Element', childPath: 'files' },
  parentWebsite: { type: Schema.Types.ObjectId, ref: 'Website', childPath: 'files' }
});

//  relations
FileSchema.plugin(relationship, { relationshipPathName: ['parentElement', 'parentWebsite'] });

module.exports = mongoose.model('File', FileSchema);
