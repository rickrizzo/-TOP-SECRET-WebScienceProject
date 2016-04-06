var express = require('express');
var request = require('request');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Render Layout
	res.render('layout', {
		title: 'Gro Gro',
		angular: '/modules/angular/angular.min.js',
		modules: '/modules/angular-route/angular-route.min.js',
		app: 'javascript/grogroapp.js',
		controllers: [
			'javascript/controllers/pageCtrl.js', 
			'javascript/controllers/aboutCtrl.js', 
			'javascript/controllers/homeCtrl.js', 
			'javascript/controllers/listCtrl.js', 
			'javascript/controllers/loginCtrl.js', 
			'javascript/controllers/navCtrl.js'],
		filters: ['javascript/filters/pageFilter.js']
	});
});

// Render Jade Partials
router.get('/partials/:name', function(req, res, next) {
	var name = req.params.name;
	res.render(name, {
		title: 'Gro Gro'
	});
});

module.exports = router;
