// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http, $location, $anchorScroll, listService) {
  
  // Page Details
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
    $location.hash('results');

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
    $anchorScroll();
  };

  // Add Food
  $scope.toggleFood = function(entry) {
    // Entry in Grocery List
    if(entry.id in $scope.groceryList) {
      entry.amount = 0;
      delete $scope.groceryList[entry.id];
      change(randomData($scope.groceryList));

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
            if(isNaN(entry.nutrition[elm])) {
              entry.nutrition[elm] = 0;
            }
          }

          // Update Entry
          $scope.groceryList[entry.id] = entry;
          change(randomData($scope.groceryList));
        });

      // Pre Exisitng Entry
      } else {
        $scope.groceryList[entry.id] = entry;
        change(randomData($scope.groceryList));
      }
    }

    // Update Service
    listService.setEntries($scope.groceryList);
  }

  // In Grocery List
  $scope.inGroceryList = function(entry) {
    if(entry.id in $scope.groceryList) {
      return true;
    }
    return false;
  }

  $scope.saveList = function() {
    $http.post('/api/create_list', {list: $scope.groceryList, name: "TestList"});
  }

  // Add Item
  $scope.incrementItem = function(entry) {
    entry.amount ++;
    change(randomData($scope.groceryList));
  }

  // Remove Item
  $scope.decrementItem = function(entry) {
    entry.amount --;
    if(entry.amount <= 0) {
      entry.amount = 0;
      delete $scope.groceryList[entry.id];
    }
    change(randomData($scope.groceryList));
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

  function getWidth() {
    if (self.innerHeight) {
      return self.innerWidth;
    }

    if (document.documentElement && document.documentElement.clientWidth) {
      return document.documentElement.clientWidth;
    }

    if (document.body) {
      return document.body.clientWidth;
    }
  }

  var first_run = true;

  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
      return d.value;
    });
  
  var arc = d3.svg.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.4);

  var outerArc = d3.svg.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

  //svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  svg.attr("transform", "translate(" + width / 5.7 + "," + height / 2 + ")");

  var key = function(d){ return d.data.label; };

  var color = d3.scale.ordinal()
    .domain(["Energy", "Sugar", "Fat", "Carbohydrates", "Fiber"])
    .range(["#b30000", "#e34a33", "#fc8d59", "#fdcc8a", "#fef0d9"]);

  function randomData (groceryList){
    var labels = color.domain();
    return labels.map(function(label){
      var value = $scope.sumNutrition(label);
      return { label: label, value: value }
    });
  }

  change(randomData({}))

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

    /* ------- TEXT LABELS -------*/
    /*var text = svg.select(".labels").selectAll("text")
      .data(pie(data), key);

    text.enter()
      .append("text")
      .attr("dy", ".35em")
      .text(function(d) {
        return d.data.label;
      });

    function midAngle(d){
      return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
      .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return "translate("+ pos +")";
        };
      })
      .styleTween("text-anchor", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? "start":"end";
        };
      });

    text.exit()
      .remove();*/

    /* ------- SLICE TO TEXT POLYLINES -------*/
    /*var polyline = svg.select(".lines").selectAll("polyline")
      .data(pie(data), key);
    
    polyline.enter()
      .append("polyline");

    polyline.transition().duration(700)
      .attrTween("points", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
    });
    
    polyline.exit()
      .remove();

    if (first_run) {
      text.remove();
      polyline.remove();
      first_run = false;
    }
    else {
      setTimeout(function(){
        /* remove text and lines if no data */
        /*var HasValue = false;

        for (var entry in data) {
          if (data[entry].value != 0) {
            HasValue = true;
          }
        }

        if (!HasValue) {
          text.remove();
          polyline.remove();
        }
      }, 700);      
    }*/
  };
});
