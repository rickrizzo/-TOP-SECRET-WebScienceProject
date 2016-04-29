var userModel = require('../models/userModel');

module.exports = {
	findOrCreate: function(profile){	
		userModel.findOne({'fb_id':profile.id},function(err, found){
			if(err){
				return false
			} else{
				if(found){
					return found;
				}else{
					var user = new userModel({
						fb_id: profile.id,
						name: profile.displayName,
						lists: []
					});

					user.save(function(err, newuser){
						return newuser;
					});	
				}
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