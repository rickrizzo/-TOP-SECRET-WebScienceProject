// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http) {
  // Page Details
  $scope.name = 'listCtrl';
  $scope.params = $routeParams;
  $scope.data = [4, 8, 15, 16, 23, 42];

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
    }, function(response) {
      console.log(response);
    });
  };

  // Search Nutrition
  $scope.getNutrition = function(id) {
    $http.get("/api/get_nutrition/" + id).then(function(response) {
      console.log(response.data);
    });
  }

  //Scale Widths
  var x = d3.scale.linear().domain([0, d3.max($scope.data)]).range([0, 400]);

  // Append Chart Bars
  d3.select('.chart').selectAll("div")
      .data($scope.data).enter().append("div")
      .style("width", function(d) { return x(d) + "px"; })
      .text(function(d) { return d; });
});
