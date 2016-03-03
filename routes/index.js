var express = require('express');
var request = require('request');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var app = angular.module("GroGro", []);

  /* using the controller */
  app.controller('Controller', function($scope, $http) {
    $scope.search = function() {
      request('http://api.nal.usda.gov/ndb/search/?format=json&q=' + $scope.input.text + '&sort=n&max=25&offset=0&api_key=' + references.API_KEY, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var data = JSON.parse(body);
          console.log(data);
          //$scope.test = data[""][""]  
        }
      });
    };
  });


  
	res.render('index', { 
			    title: 'Gro Gro',
			    scripts: ['javascript/activenav.js'],
			});
});



module.exports = router;
