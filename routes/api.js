var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function(req, res, next) {
  res.send('bad api endpoint');
});

router.get('/get_food/:food', function(req, res, next) {
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
      }
      for (var item in returned_items_names) {
        return_data[returned_items_names[item]] = returned_items_ids[item];
      }
      res.send(return_data);
    }
    else {
      res.send("Got error");
    }
  });
});

router.get('/get_nutrition/:food_id', function(req, res, next) {
  //console.log("getting food nutrition");
  var food = req.params.food_id;

  var interested = ["Energy", "Sugars, total", "Total lipid (fat)", "Carboydrate, by difference", "Fiber, total dietary"];
  var return_data = {};

  request('http://api.nal.usda.gov/ndb/reports/?ndbno=' + food + '&type=b&format=json&api_key=DEMO_KEY', function(error, res2, body) {
    if (!error && res2.statusCode == 200) {
      data = JSON.parse(res2.body);
      var nutrients = data.report.food["nutrients"];
      //console.log(nutrients);
      for (var item in nutrients) {
        if (interested.indexOf(nutrients[item]["name"]) != -1) {
          return_data[nutrients[item]["name"]] = nutrients[item]["value"];
        }
      }
      res.send(return_data);
    }
  });
});

router.get('/get_list/:list', function(req, res, next) {
  var list_name = req.params.list;
  res.send('gets nutrition info for food');
});

router.get('/update_list/:list', function(req, res, next) {
  var list = req.params.list;
  res.send('updates a users list');
});

router.get('/del_list/:list', function(req, res, next) {
  var list = req.params.list;
  res.send('deletes a users list');
});

module.exports = router;
