var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//  schema
var ShareSchema = new Schema({
  email: String,
  website: { type: Schema.Types.ObjectId, ref: 'Website' }
});

//  model
var Share = mongoose.model('Share', ShareSchema);

module.exports = Share;
