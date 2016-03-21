var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
  res.send('bad api endpoint');
});

router.get('/get_nutrition/:food', function(req, res, next) {
  var food = req.params.food;
  var returned_items_ids = [];
  var returned_items_names = [];
  var return_data = {};
  var data = null;

  request('http://api.nal.usda.gov/ndb/search/?format=json&q=' + food + '&sort=r&offset=0&api_key=DEMO_KEY', function (error, res1, body) {
    if (!error && res1.statusCode == 200) {
      data = JSON.parse(res1.body);
      for (var item in data.list.item) {
        returned_items_ids.push(data.list.item[item]["ndbno"]);
        returned_items_names.push(data.list.item[item]["name"]);
        
        return_data["ids"] = returned_items_ids;
        return_data["names"] = returned_items_names;
      }
      res.send(return_data);
    }
    else {
      res.send("Got error");
    }
  });
});

router.get('/api/get_list/:list', function(req, res, next) {
  var list_name = req.params.list;
  res.send('gets nutrition info for food');
});

router.get('/api/update_list/:list', function(req, res, next) {
  var list = req.params.list;
  res.send('updates a users list');
});

router.get('/api/del_list/:list', function(req, res, next) {
  var list = req.params.list;
  res.send('deletes a users list');
});

module.exports = router;
