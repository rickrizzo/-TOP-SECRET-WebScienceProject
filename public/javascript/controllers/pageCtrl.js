app.controller('pageCtrl', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
});

app.controller('homeCtrl', function($scope, $routeParams) {
  $scope.name = 'homeCtrl';
  $scope.params = $routeParams;
});

app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/test', {
    templateUrl: 'partials/index',
    controller: 'homeCtrl'
  }).otherwise({
    redirectTo: 'partials/error'
  });
  /*$routeProvider.when('/test', {
    templateUrl: 'partials/index.jade',
    controller: 'homeCtrl'
  });*/
});