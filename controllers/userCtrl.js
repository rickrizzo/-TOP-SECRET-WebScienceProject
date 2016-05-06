var userModel = require('../models/userModel');

module.exports = {
	// return an existing user or create a new one
	findOrCreate: function(req, res){	
		userModel.findOne({'fb_id':req.profile.id},function(err, found){
			if(err){
				return false
			} else{
				if(found){
					res.send(found);
				}else{
					var user = new userModel({
						fb_id: req.profile.id,
						name: req.profile.displayName,
						lists: []
					});

					user.save(function(err, newuser){
						res.send(newuser);
					});	
				}
			}
		});
	},
	// add a list to a user's lists array
	addList: function(req, res){
		userModel.findOne({'fb_id':req.user_id}, function(err, found){
			if(found){
				found.lists.push(req.list_id);
				found.save();
			}
		});
	},
	// delete a user
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