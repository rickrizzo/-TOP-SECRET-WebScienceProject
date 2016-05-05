var itemModel = require('../models/itemModel');

module.exports = {
	findOrCreate: function(req, callback){	
		itemModel.findOne({'api_id':req.api_id}).lean().exec(function(err, found){
			var hold;
			if(err){
				err;
			} else{
				if(found){
					//console.dir(found);
					//hold = found;
					callback(err, found);
				}else{
					var item = new itemModel({
						api_id: req.api_id,
						name: req.nutrition.name,
						nutrition: {
							energy: req.nutrition.Energy,
							sugars: req.nutrition['Sugars, total'],
							fat: req.nutrition['Total lipid (fat)'],
							carbs: req.nutrition['Carbohydrate, by difference'],
							fiber: req.nutrition['Fiber, total dietary']
						}
					});

					item.save(function(err, newitem){
						if(err){
							err;
						}
						callback(err, found);
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