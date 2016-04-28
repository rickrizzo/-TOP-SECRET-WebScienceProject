// List Page Controller
app.controller('listCtrl', function($scope, $routeParams, $http) {
  // Page Details
  $scope.name = 'listCtrl';
  $scope.params = $routeParams;
  $scope.groceryList = {};
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
    var tmp = []

    // Add Items
  	$http.get('/api/get_food/' + food).then(function(response) {
      for(var food in response.data) {
        tmp.push({ 
          food : food,
          id: response.data[food],
          nutrition: {},
          added: false
        });
      }

      // Add Nutrition Information
      tmp.forEach(function(entry) {
        $http.get('/api/get_nutrition/' + response.data[food]).then(function(nutrition) {
          entry.nutrition['Energy'] = parseInt(nutrition.data['Energy']);
          entry.nutrition['Fat'] = parseInt(nutrition.data['Total lipid (fat)']);
          entry.nutrition['Carbohydrates'] = parseInt(nutrition.data['Carbohydrate, by difference']);
          entry.nutrition['Sugar'] = parseInt(nutrition.data['Sugars, total']);
          entry.nutrition['Fiber'] = parseInt(nutrition.data['Fiber, total dietary']);
        });
      });

      $scope.entries = tmp;
    }, function(response) {
      console.log(response);
    });
  };

  // Add Food
  $scope.toggleFood = function(entry) {
    if(entry.added) {
      delete $scope.groceryList[entry.id];
      entry.added = false;
    } else {
      $scope.groceryList[entry.id] = entry;
      entry.added = true;
    }
    change(randomData($scope.groceryList));
  }

  // Get Nutrition
  $scope.getNutrition = function(category) {
    var total = 0;
    for(var entry in $scope.groceryList) {
      total += $scope.groceryList[entry].nutrition[category];
    }
    return total;
  }

  var svg = d3.select(".chart > svg")
  if (svg.empty()) {

    var svg = d3.select(".chart")
      .append("svg")
      .append("g")

    svg.append("g")
      .attr("class", "slices");
    svg.append("g")
      .attr("class", "labels");
    svg.append("g")
      .attr("class", "lines");
  }

  var width = 900,
      height = 400,
      radius = Math.min(width, height) / 2;

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

  svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var key = function(d){ return d.data.label; };

  var color = d3.scale.ordinal()
    .domain(["Energy", "Sugar", "Fat", "Carbohydrates", "Fiber"])
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

  function randomData (groceryList){
    var labels = color.domain();
    return labels.map(function(label){
      var value = 0
      for (var entry in groceryList) {
        value += groceryList[entry]["nutrition"][label];
      }

      return { label: label, value: value }
    });
  }

  function change(data) {
    /* ------- PIE SLICES -------*/
    var slice = svg.select(".slices").selectAll("path.slice")
      .data(pie(data), key);

    slice.enter()
      .insert("path")
      .style("fill", function(d) { return color(d.data.label); })
      .attr("class", "slice");

    slice   
      .transition().duration(1000)
      .attrTween("d", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      })

    slice.exit()
      .remove();

    /* ------- TEXT LABELS -------*/
    var text = svg.select(".labels").selectAll("text")
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
      .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/
    var polyline = svg.select(".lines").selectAll("polyline")
      .data(pie(data), key);
    
    polyline.enter()
      .append("polyline");

    polyline.transition().duration(1000)
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

    /* remove text and lines if no data */
    var HasValue = false;

    for (var entry in data) {
      if (data[entry].value != 0) {
        HasValue = true;
      }
    }

    if (!HasValue) {
      text.remove();
      polyline.remove();
    }
  };

});
