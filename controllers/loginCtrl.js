var userModel = require('../models/userModel');

module.exports = {
	create: function(req, res){
		var user = new userModel({
			fb_id: req.params.profile.id,
			name: req.params.profile.name.givenname + req.params.profile.name.familyname,
			lists: []
		});

		user.save(function(err, user){
			if(err){
				return res.status(500).json({
					message: 'Error saving user',
					error: err
				});
			}
			return res.json({
				message: "saved"
			});
		});
	},
	delete: function(req, res){
		userModel.remove({
			'_id' : req.params.user_id
		}, function(err, user){
			if(err){
				return res.status(500).json({
			      	message: 'Error deleting user',
			      	error: err
			    });
			}
			return res.json(user);
		});
	}
};