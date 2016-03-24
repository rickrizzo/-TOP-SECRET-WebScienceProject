// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http) {
  // Page Details
  $scope.name = 'listCtrl';
  $scope.params = $routeParams;

  // Pagination
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.entries = [];
  $scope.numPages = function() {
    return Math.ceil($scope.entries.length / $scope.pageSize);
  }
  
  // Search Food
  $scope.getFood = function() {
    $scope.entries.length = 0;
    var food = $scope.query.text;
  	$http.get("/api/get_food/" + food).then(function(response) {
      for(var food in response.data) {
        $scope.entries.push(
          { 
            food : food,
            id: response.data[food]
          });
      }
    });
  };

  // Search Nutrition
  $scope.getNutrition = function(id) {
    $http.get("/api/get_nutrition/" + id).then(function(response) {
      console.log(response.data);
    });
  }
});
