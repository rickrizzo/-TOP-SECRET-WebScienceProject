var express = require('express');
var request = require('request');
var references = require('../references')

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	request('http://api.nal.usda.gov/ndb/search/?format=json&q=oreos&sort=n&max=25&offset=0&api_key=' + references.API_KEY, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	    	var data = JSON.parse(body);
	    	console.log(data["list"]["q"]);
	    	var oreos = data["list"]["q"];
	        res.render('index', { 
			    title: 'Gro Gro',
			    jquery: '/modules/jquery/dist/jquery.min.js',
			    scripts: ['javascript/activenav.js', 'javascript/getfood.js'],
			    oreos: oreos
			});
	     }
	});
});

module.exports = router;
