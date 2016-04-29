var listModel = require('../models/listModel');
var itemCtrl = require('./itemCtrl');

module.exports = {
	findOrCreate: function(req, res){	
		listModel.findOne({'name':req.name},function(err, found){
			if(err){
				return null;
			} else{
				if(found){
					return found;
				}else{
					var list = new listModel({
						user_id: req.user_id,
						name: req.name,
						items: []
					});

					list.save(function(err, newlist){
						return newlist;
					});	
				}
			}
		});
	},
	addItem: function(req, res){
		listModel.findOne({'name':req.list_name}, function(err, found){
			if(err){
				return null;
			}else{
				if(found){
					var item = itemCtrl.findOrCreate(req, res);
					found.items.push(item);
					found.save();
				}
			}
		});
	},
	delete: function(req,res){
		listModel.remove({
			'name' : req.name
		}, function(err, list){
			if(err){
				return null;
			}
			return list;
		});
	}
};