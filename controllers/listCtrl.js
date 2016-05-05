var listModel = require('../models/listModel');
var itemCtrl = require('./itemCtrl');
var userCtrl = require('./userCtrl');

module.exports = {
	findOrCreate: function(req, res){	
		listModel.findOne({'name':req.name, 'user_id': req.user_id}, function(err, found){
			if(err){
				return err;
			} else{
				if(found){
					hold = found.items;
					if(res) return res.send(JSON.stringify(found));
				}else{
					var list = new listModel({
						user_id: req.user_id,
						created: new Date(),
						name: req.name,
						items: []
					});
					userCtrl.addList({list_id: req.name, user_id: req.user_id});
					list.save(function(err, newlist){
						if(err) return err;
						if(res) return res.send(JSON.stringify(newlist));
					});	
				}
			}
			
		});
	},
	addItem: function(req, res){
		listModel.findOne({'name':req.name, 'user_id': req.user_id}, function(err, found){
			if(err){
				return null;
			}else{
				if(found){
					found.items.push(req.api_id);
					found.save();
				}
			}
		});
	},
	showAllLists: function(req, res){
		listModel.find({'user_id': req.user_id}, function(err, lists){
			var allLists = {}
			lists.forEach(function(list){
				allLists[list._id] = list;
			});
			res.send(allLists);
		});
	},
	delete: function(req,res){
		listModel.remove({
			'name' : req.name,
			'user_id': req.user_id
		}, function(err, list){
			if(err){
				return null;
			}
			return list;
		});
	}
};