var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var listModel = require('listModel.js');

var userSchema = new Schema({
	"user_id": ObjectId,
	"fb_id": String,
	"name": String,
	"lists": [listModel.schema]
});

// I don't know what this does but it's similar to
// what's in Rob's breadcrumbs/models/crumbModel.js
// module.exports = mongoose.model('grogro', userSchema);