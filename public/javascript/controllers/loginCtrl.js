// Login Controller
app.controller('loginCtrl', function($scope, $routeParams, $http, $window) {
  $scope.name = 'loginCtrl';
  $scope.params = $routeParams;

  $scope.facebook = function(){
  	$window.location = 'http://' + $window.location.host + '/fb_login/auth/facebook';
  };
});
