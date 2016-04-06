var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var itemSchema = new Schema({
	"item_id": ObjectId,
	"api_id": String,
	"name": String
});

// I don't know what this does but it's similar to
// what's in Rob's breadcrumbs/models/crumbModel.js
// module.exports =	mongoose.model('grogro', itemSchema);