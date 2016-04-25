// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http) {
  // Page Details
  $scope.name = 'listCtrl';
  $scope.params = $routeParams;
  $scope.nutritionData = {
    'energy': 0,
    'fat': 0,
    'fiber': 0,
    'sugar': 0
  }
  $scope.data = [4, 8, 16, 24, 32, 40];

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
  	$http.get('/api/get_food/' + food).then(function(response) {
      for(var food in response.data) {
        $http.get('/api/get_nutrition/' + response.data[food]).then(function(nutrition) {
          $scope.entries.push(
          { 
            food : food,
            id: response.data[food],
            nutrition: nutrition.data,
            added: false
          });
        })
      }
    }, function(response) {
      console.log(response);
    });
  };

  // Add Food
  $scope.toggleFood = function(entry) {
    if(entry.added) {
      $scope.nutritionData.energy -= +entry.nutrition['Energy'];
      $scope.nutritionData.fat -= +entry.nutrition['Total lipid (fat)'];
      $scope.nutritionData.fiber -= +entry.nutrition['Fiber, total dietary'];
      $scope.nutritionData.sugar -= +entry.nutrition['Sugars, total'];
      entry.added = false;
    } else {
      $scope.nutritionData.energy += +entry.nutrition['Energy'];
      $scope.nutritionData.fat += +entry.nutrition['Total lipid (fat)'];
      $scope.nutritionData.fiber += +entry.nutrition['Fiber, total dietary'];
      $scope.nutritionData.sugar += +entry.nutrition['Sugars, total'];
      entry.added = true;
    }
  }

  //Scale Widths
  var x = d3.scale.linear().domain([0, d3.max($scope.data)]).range([0, 400]);

  // Append Chart Bars
  d3.select('.chart').selectAll('div')
      .data($scope.data).enter().append('div')
      .style("width", function(d) { return x(d) + 'px'; })
      .text(function(d) { return d; });
});
