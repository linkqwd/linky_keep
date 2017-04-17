var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contentSchema = new Schema({
	sample: String
});

module.exports = mongoose.model('cols12', contentSchema);