var itemModel = require('../models/itemModel');

module.exports = {
	findOrCreate: function(req, res){	
		itemModel.findOne({'api_id':req.id},function(err, found){
			if(err){
				return null;
			} else{
				if(found){
					return found;
				}else{
					var item = new itemModel({
						api_id: req.id,
						name: req.name,
						nutrition: {
						}
					});

					item.save(function(err, newitem){
						return newitem;
					});	
				}
			}
		});
	},
	delete: function(req,res){
		itemModel.remove({
			'item_id' : req.item_id
		}, function(err, item){
			if(err){
				return null;
			}
			return item;
		});
	}
};
