// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http) {
  $scope.name = 'listCtrl';
  $scope.params = $routeParams;
  
  $scope.search = function() {
  	$http.get("/api/get_food/" + $scope.query.text).then(function(response) {
      $scope.names = response.data;
    });
  };
});