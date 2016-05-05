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
        //$scope.mealinfo = response.data['items'];
        var vals = [];
        console.log(response.data['items']);
        angular.forEach(response.data['items'], function(d){
          $http.get("/api/get_item/" + d).then(function(response) {
            console.log(response.data);
            var val = '{"food":"';
            val += response.data['name'] + '","nutrition":{"Energy":"';
            val += response.data['nutrition']['energy'] + '","Fat":"';
            val += response.data['nutrition']['fat'] + '","Carbohydrates":"';
            val += response.data['nutrition']['carbs'] + '","Sugars":"';
            val += response.data['nutrition']['sugars'] + '"}}';
            vals.push(JSON.parse(val));
          });
        });
        $scope.mealinfo = vals;
     });
  };
 

});