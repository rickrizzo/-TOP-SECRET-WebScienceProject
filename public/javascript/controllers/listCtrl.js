// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http) {
  $scope.name = 'listCtrl';
  $scope.params = $routeParams;
  
  $scope.search = function() {
  	console.log("getting information from api");
    var food = $scope.query.text;
  	$http.get("/api/get_food/" + food).then(function(response) {
  	  console.log(response.data);
      $scope.names = response.data;
    });
  };
});