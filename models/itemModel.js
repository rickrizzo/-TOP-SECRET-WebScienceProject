var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var itemSchema = new Schema({
	"item_id": ObjectId,
	"api_id": String,
	"name": String,
	"nutrition":{
		"energy": String,
		"sugars": String,
		"fat": String,
		"carbs": String,
		"fiber": String
	}
});

module.exports = mongoose.model('Item', itemSchema);