// Routing Controller
app.controller('pageCtrl', function($scope, $route, $routeParams, $location) {
	$scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
});

// Routing Configuration
app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/', {
    templateUrl: 'partials/index',
    controller: 'homeCtrl'
  }).when('/lists', {
    templateUrl: 'partials/lists',
    controller: 'listCtrl'
  }).when('/about', {
    templateUrl: 'partials/about',
    controller: 'aboutCtrl'
  }).when('/login', {
    templateUrl: 'partials/login',
    controller: 'loginCtrl'
  }).otherwise({
    redirectTo: 'partials/error'
  });
});



