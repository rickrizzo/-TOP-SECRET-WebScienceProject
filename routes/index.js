var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	/*request('http://api.nal.usda.gov/ndb/search/?format=json&q=oreos&sort=n&max=25&offset=0&api_key=x0Ek3fBDERrmYdHdKhNZQmeH3L6JY17hYd1aYUCj', function (error, response, body) {
		if (!error && response.statusCode == 200) {
	  	var data = JSON.parse(body);
	    console.log(data["list"]["q"]);
		}
	});*/
	res.render('layout', { 
		angular: '/modules/angular/angular.min.js',
		modules: '/modules/angular-route/angular-route.min.js',
		app: 'javascript/grogroapp.js',
		controllers: 'javascript/controllers/pageCtrl.js'
	});
});

router.get('/partials/:name', function(req, res, next) {
	var name = req.params.name;
	res.render(name, {
		title: 'Gro Gro'
	});
});

module.exports = router;
