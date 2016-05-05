// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http, listService) {
  
  // Page Details
  $scope.reset = {title: ' '};
  $scope.name = 'listCtrl';
  $scope.params = $routeParams;
  $scope.groceryList = listService.getEntries();
  $scope.recommended_nutrition = {"Energy": 2600, "Sugar": 60, "Fat": 55, "Carbohydrates": 225, "Fiber": 31.5};  

  // Clear Query
  $scope.clearSearch = function() {
    $scope.query.text.length = 0;
    $scope.entries.length = 0;
  }

  // Pagination
  $scope.currentPage = 0;
  $scope.pageSize = 10;
  $scope.entries = [];
  $scope.noresults = false;
  $scope.numPages = function() {
    return Math.ceil($scope.entries.length / $scope.pageSize);
  }
  
  // Search Food
  $scope.getFood = function() {
    $scope.entries.length = 0;
    var food = $scope.query.text;
    var tmp = []

    // Add Items
  	$http.get('/api/get_food/' + food).then(function(response) {
      $scope.noresults = false;
      for(var food in response.data) {
        $scope.entries.push({ 
          food : food,
          id: response.data[food],
          nutrition: null,
          amount: 0
        });
      }
    }, function(response) {
      $scope.noresults = true;
    });
  };

  // Add Food
  $scope.toggleFood = function(entry) {
    // Create Grocery List
    if(!$scope.groceryList) {
      $scope.groceryList = {};
    }

    // Entry in Grocery List
    if(entry.id in $scope.groceryList) {
      entry.amount = 0;
      delete $scope.groceryList[entry.id];
      change(newData($scope.groceryList));

    // Entry not in List
    } else {
      entry.amount = 1;

      // Never Added
      if(!entry.nutrition) {
        entry.nutrition = {};
        $scope.groceryList[entry.id] = entry;
        $http.get('/api/get_nutrition/' + entry.id).then(function(nutrition) {

          // Set Nutrition
          entry.nutrition['Energy'] = parseInt(nutrition.data['Energy']) / $scope.recommended_nutrition["Energy"];
          entry.nutrition['Fat'] = parseInt(nutrition.data['Total lipid (fat)']) / $scope.recommended_nutrition["Fat"];
          entry.nutrition['Carbohydrates'] = parseInt(nutrition.data['Carbohydrate, by difference']) / $scope.recommended_nutrition["Carbohydrates"];
          entry.nutrition['Sugar'] = parseInt(nutrition.data['Sugars, total']) / $scope.recommended_nutrition["Sugar"];
          entry.nutrition['Fiber'] = parseInt(nutrition.data['Fiber, total dietary']) / $scope.recommended_nutrition["Fiber"];

          // Check Input
          for(var elm in entry.nutrition){
            if(isNaN(entry.nutrition[elm]) || entry.nutrition[elm] == undefined) {
              entry.nutrition[elm] = 0;
            }
          }

          // Update Entry
          $scope.groceryList[entry.id] = entry;
          change(newData($scope.groceryList));
        });

      // Pre Exisitng Entry
      } else {
        $scope.groceryList[entry.id] = entry;
        change(newData($scope.groceryList));
      }
    }

    // Update Service
    listService.setEntries($scope.groceryList);
  }

  // In Grocery List
  $scope.inGroceryList = function(entry) {
    if(!$scope.groceryList) {
      return false;
    }
     else if(entry.id in $scope.groceryList) {
      return true;
    }
    return false;
  }

  // saves a users list to the database
  $scope.saveList = function() {
    $http.post('/api/create_list', {list: $scope.groceryList, name: "TestList"});
  }

  // Add Item
  $scope.incrementItem = function(entry) {
    entry.amount ++;
    change(newData($scope.groceryList));
  }

  // Remove Item
  $scope.decrementItem = function(entry) {
    entry.amount --;
    if(entry.amount <= 0) {
      entry.amount = 0;
      delete $scope.groceryList[entry.id];
    }
    change(newData($scope.groceryList));
  }

  // Sum Nutrition
  $scope.sumNutrition = function(category) {
    var total = 0;
    for(var entry in $scope.groceryList) {
      total += ($scope.groceryList[entry].nutrition[category] * $scope.groceryList[entry].amount);
    }
    return total;
  }


  // D3 Chart
  var svg = d3.select(".chart > svg")
  var width = 900 * 0.95,
      height = 400 * 0.95,
      radius = Math.min(width, height) / 2;

  // ensures we won't have multiple charts on the page
  if (svg.empty()) {
    var svg = d3.select(".chart")
      .append("svg")
      //.attr("width", width)
      .attr("height", height)
      .attr("viewbox", "0 0 " + width + ' ' + height)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .append("g")

    svg.append("g")
      .attr("class", "slices");
    svg.append("g")
      .attr("class", "labels");
    svg.append("g")
      .attr("class", "lines");
  }

  // returns the values for the pie chart
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      return d.value;
    });
  
  // the arcs of the pie chart
  var arc = d3.svg.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.4);

  var outerArc = d3.svg.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);
  
  // translates the svg to the part of the page we want  
  svg.attr("transform", "translate(" + width / 5.7 + "," + height / 2 + ")");

  // the key of the data is the nutrition name
  var key = function(d){ return d.data.label; };

  // colors and legend of the pie chart
  var color = d3.scale.ordinal()
    .domain(["Energy", "Sugar", "Fat", "Carbohydrates", "Fiber"])
    .range(["#b30000", "#e34a33", "#fc8d59", "#fdcc8a", "#fef0d9"]);

  // returns new data to the pie chart when the data is changed
  function newData (groceryList){
    var labels = color.domain();
    return labels.map(function(label){
      var value = $scope.sumNutrition(label);
      return { label: label, value: value }
    });
  }

  // create an empty pie chart when the page is initalized
  change(newData({}))

  // animation for when the data is changed
  function change(data) {
    /* ------- PIE SLICES -------*/
    var slice = svg.select(".slices").selectAll("path.slice")
      .data(pie(data), key);

    slice.enter()
      .insert("path")
      .style("fill", function(d) { return color(d.data.label); })
      .attr("class", "slice");

    slice.transition().duration(1000)
      .attrTween("d", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      });

    slice.exit()
      .remove();
  };
});
