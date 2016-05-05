// Login Controller
app.controller('loginCtrl', function($scope, $routeParams, $http, $window) {
  $scope.name = 'loginCtrl';
  $scope.params = $routeParams;
  $scope.loggedin = false;
  $scope.heading = 'Login';

  $scope.facebook = function(){
  	$window.location = 'http://' + $window.location.host + '/fb_login/auth/facebook';
  };
  console.log('hello?')

  $http.get('/fb_login/isloggedin').then(function(res){
    console.log("MAKING REQUEST");
    if(res){
      $scope.loggedin = true;
      console.log(document.getElementById('login').value);
    } else {
      console.log("nothing");
    }
  });

});
