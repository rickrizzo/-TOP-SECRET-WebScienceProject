// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http) {
  $scope.name = 'listCtrl';
  $scope.params = $routeParams;
  
  // Search Food
  $scope.getFood = function() {
    var food = $scope.query.text;
  	$http.get("/api/get_food/" + food).then(function(response) {
      $scope.names = response.data;
    });
  };

  // Search Nutrition
  $scope.getNutrition = function(id) {
    $http.get("/api/get_nutrition/" + id).then(function(response) {
      console.log(response.data);
    });
  }
});