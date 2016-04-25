var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var itemModel = require('./itemModel');

var listSchema = new Schema({
	"list_id": ObjectId,
	"user_id": String,
	"items": [itemModel.schema]
});


module.exports = mongoose.model('List', listSchema);