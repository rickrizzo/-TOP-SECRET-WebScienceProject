var userModel = require('../models/userModel.js');

// Login Controller
app.controller('loginCtrl', function($scope, $routeParams) {
  $scope.name = 'loginCtrl';
  $scope.params = $routeParams;
});

module.exports = {
	create: function(req, res){
		var user = new userModel({
			fb_id: req.params.id,
			name: req.params.name,
			lists: []
		});

		user.save(function(err, user){
			if(err){
				// error handling
			}
			return res.json({
				message: "saved",
				_id = user.user_id
			});
		});
	},
	delete: function(req, res){
		userModel.remove({
			_id : req.params.user_id
		}, function(err, user){
			if(err){
				// error handling
			}
			return res.json(user);
		});
	}
};