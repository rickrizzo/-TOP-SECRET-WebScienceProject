// Login Controller
app.controller('loginCtrl', function($scope, $routeParams, $http, $window) {
  $scope.name = 'loginCtrl';
  $scope.params = $routeParams;
  $scope.loggedin = false;
  $scope.heading = 'Login';

  $scope.facebook = function(){
  	$window.location = 'http://' + $window.location.host + '/fb_login/auth/facebook';
  };

  $http.get('/fb_login/isloggedin').then(function(res){
    if(res){
      $scope.loggedin = true;
      $scope.heading = 'Hello, ' + res.data[0].name;
    } else {
      $scope.loggedin = false;
      console.log("nothing");
    }
  });

});
