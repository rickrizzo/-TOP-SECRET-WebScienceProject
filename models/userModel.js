var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var listModel = require('./listModel');

var userSchema = new Schema({
	"user_id": ObjectId,
	"fb_id": String,
	"name": String,
	"lists": []
});


module.exports = mongoose.model('User', userSchema);