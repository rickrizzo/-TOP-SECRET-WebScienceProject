var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Gro Gro',
    jquery: '/modules/jquery/dist/jquery.min.js',
    scripts: ['javascript/activenav.js'] 
  });
});

module.exports = router;
