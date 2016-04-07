var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var itemModel = require('itemModel.js');

var listSchema = new Schema({
	"list_id": ObjectId,
	"user_id": String,
	"items": [itemModel.schema]
});

// I don't know what this does but it's similar to
// what's in Rob's breadcrumbs/models/crumbModel.js
// module.exports = mongoose.model('grogro', listSchema);