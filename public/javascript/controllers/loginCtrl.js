var userModel = require('../models/userModel.js');

// Login Controller
app.controller('loginCtrl', function($scope, $routeParams) {
  $scope.name = 'loginCtrl';
  $scope.params = $routeParams;
});

module.exports = {
	create: function(req, res){
		var user = new userModel({
			lists: []
		});

		user.save(function(err, user){
			if(err){
				// error handling
			}
			return res.json({
				message: "saved",
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