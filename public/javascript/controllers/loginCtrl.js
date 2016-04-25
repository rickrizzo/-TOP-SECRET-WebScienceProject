// Login Controller
app.controller('loginCtrl', function($scope, $routeParams, $http) {
  $scope.name = 'loginCtrl';
  $scope.params = $routeParams;

  $scope.facebook = function(){
  	$http.get("/fb_login/auth/facebook").then(function(response) {
  		document.getElementById("response").innerHTML = response.data;
  		document.getElementById("login_form").action = "https://www.facebook.com/login.php?login_attempt=1&amp;next=https%3A%2F%2Fwww.facebook.com%2Fv2.5%2Fdialog%2Foauth%3Fredirect_uri%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fauth%252Ffacebook%252Fcallback%26scope%3Demail%26response_type%3Dcode%26client_id%3D176656516048298%26ret%3Dlogin&amp;lwv=100"
  	});
  };
});
