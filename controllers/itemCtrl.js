var itemModel = require('../models/itemModel');

module.exports = {
	findOrCreate: function(req, res){	
		itemModel.findOne({'api_id':req.api_id},function(err, found){
			if(err){
				return err;
			} else{
				if(found){
					if(res) return res.send(JSON.stringify(found));
				}else if(req.nutrition) {
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
							return err;
						}
						if(res) return res.send(JSON.stringify(newitem));
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