// About Page Controller
app.controller('aboutCtrl', function($scope, $routeParams, $http) {
  $scope.name = 'aboutCtrl';
  $scope.params = $routeParams;
  $scope.mealinfo = [];
  $scope.recommended_nutrition = {"Energy": 2600, "Sugar": 60, "Fat": 55, "Carbohydrates": 225, "Fiber": 31.5};

  //$scope.pass = {lname : "TestList"};
  // Get Latest Grocery List
  $scope.getHistory = function(){
  	 $http.get("/api/get_list").then(function(response) {
              //$scope.allData = response.data;
     console.log(response.data);
              
     });
  };
 

});