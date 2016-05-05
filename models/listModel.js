var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var itemModel = require('./itemModel');

var listSchema = new Schema({
	"list_id": ObjectId,
	"user_id": String,
	"created": Date,
	"name": String,
	"items": []
});


module.exports = mongoose.model('List', listSchema);