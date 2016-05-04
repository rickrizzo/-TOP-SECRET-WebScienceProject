// About Page Controller
app.controller('aboutCtrl', function($scope, $routeParams, listService) {
  $scope.name = 'aboutCtrl';
  $scope.params = $routeParams;
  $scope.mealinfo = [];

  // Get Latest Grocery List
  $scope.$watch(function() { return listService.getEntries(); }, function(newValue, oldValue) {
    if (newValue != null) {
       var obj = newValue;
    	//console.log(newValue);
   		for (var key in obj) {
  		  if (obj.hasOwnProperty(key)) {
  		    var val = obj[key];
  		    $scope.mealinfo.push(val);
  		  }
		  }
    }
  }, true);


});