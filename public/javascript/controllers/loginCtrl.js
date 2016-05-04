// Login Controller
app.controller('loginCtrl', function($scope, $routeParams, $http, $window) {
  $scope.name = 'loginCtrl';
  $scope.params = $routeParams;

  $scope.facebook = function(){
  	$window.location = 'http://' + $window.location.host + '/fb_login/auth/facebook';
  	$http.get('/fb_login/isloggedin').then(function(res){
  		if(res){
  			document.getElementById('login').value = res.data[0].name;
  		}
  	});
  };
});
