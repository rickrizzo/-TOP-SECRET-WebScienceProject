// About Page Controller
app.controller('aboutCtrl', function($scope, $routeParams, listService) {
  $scope.name = 'aboutCtrl';
  $scope.params = $routeParams;

  // Get Latest Grocery List
  $scope.$watch(function() { return listService.getEntries(); }, function(newValue, oldValue) {
    if (newValue != null) {
      console.log(newValue);
    }
  }, true);


});