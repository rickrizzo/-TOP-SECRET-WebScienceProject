// Login Controller
app.controller('loginCtrl', function($scope, $routeParams, $http, $window, loginService) {
  $scope.name = 'loginCtrl';
  $scope.params = $routeParams;
  $scope.loggedin = false;
  $scope.heading = 'Login';
  $scope.facebook = function(){
  	$window.location = 'http://' + $window.location.host + '/fb_login/auth/facebook';
    $scope.out = true;
  };

  $http.get('/fb_login/isloggedin').then(function(res){
    if(res){
      $scope.loggedin = true;
      $scope.heading = 'Hello, ' + res.data[0].name;
      loginService.setLoginStatus(res.data[0].name);
    } else {
      $scope.loggedin = false;
      console.log("nothing");
    }
  });

  $scope.logout = function(){
    $http.get('/fb_login/logout').then(function(res){
      $scope.heading = 'Login';
      $scope.loggedin = false;
    });
  };

});
