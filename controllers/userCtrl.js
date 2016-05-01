var userModel = require('../models/userModel');

module.exports = {
	findOrCreate: function(req, res){	
		userModel.findOne({'fb_id':req.profile.id},function(err, found){
			if(err){
				return false
			} else{
				if(found){
					return found;
				}else{
					var user = new userModel({
						fb_id: req.profile.id,
						name: req.profile.displayName,
						lists: []
					});

					user.save(function(err, newuser){
						return newuser;
					});	
				}
			}
		});
	},
	addList: function(req, res){
		userModel.findOne({'user_id':req.user_id}, function(err, found){
			if(found){
				found.lists.push(req.list_id);
			}
		});
	},
	delete: function(req,res){
		userModel.remove({
			'_id' : req.params.user_id
		}, function(err, user){
			if(err){
				console.log(err)
			}
			return user;
		});
	}
};