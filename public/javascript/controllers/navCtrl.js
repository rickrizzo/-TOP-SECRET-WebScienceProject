// Navigation Controller
app.controller('navCtrl', function($scope, $location) {
  $scope.initSelect = function() {
    if($location.path() == '/') {
      return 'home';
    }
    if($location.path() == '/lists') {
      return 'lists';
    }
    if($location.path() == '/about') {
      return 'about';
    }
    if($location.path() == '/login') {
      return 'login';
    }
  }
});
