var express = require('express');
var router = express.Router();
var request = require('request');

var apikeys = ['c7cIi88CYsXPaT1sxqhLSLz2OaROEEOdjFFHff79', 'BD5eu8hQLzoGG2jmEjkF4EBhT9HU4uEeJcjFz9oW', 'CSnXW6BKcazu7RgncwWKqLCGzodQNDxWLm1Q0VP3'];

var current_key = 0;

// Get Food
router.get('/get_food/:food', function(req, res, next) {
  var food = req.params.food;
  var return_data = {};
  var data = null;

  if (current_key == apikeys.length) {
    current_key = 0;
  }

  request('http://api.nal.usda.gov/ndb/search/?format=json&q=' + food + '&sort=r&offset=0&api_key=' + apikeys[current_key], function (error, res1, body) {
    console.log("Ratelimit Remaining on key " + current_key +": " + res1.caseless.dict["x-ratelimit-remaining"]);
    if (res1.caseless.dict["x-ratelimit-remaining"] <= 20) {
      if (current_key == apikeys.length - 1) {
        current_key = 0;
      }
      else {
        current_key++;
      }
    }

    if (!error && res1.statusCode == 200) {
      data = JSON.parse(res1.body);
      for (var item in data.list.item) {
        return_data[data.list.item[item]["name"]] = data.list.item[item]["ndbno"];
      }
      res.send(return_data);
    }
    else {
      console.log("ERROR!", body);
      res.status(500).send("Invalid food query!");
    }
  });
});

router.get('/get_nutrition/:food_id', function(req, res, next) {
  var food = req.params.food_id;
  var interested = ["Energy", "Sugars, total", "Total lipid (fat)", "Carbohydrate, by difference", "Fiber, total dietary"];
  var return_data = {};

  request('http://api.nal.usda.gov/ndb/reports/?ndbno=' + food + '&type=b&format=json&api_key=' + apikeys[current_key], function(error, res2, body) {
    console.log("Ratelimit Remaining on key " + current_key +": " + res2.caseless.dict["x-ratelimit-remaining"]);
    if (res2.caseless.dict["x-ratelimit-remaining"] <= 20) {
      if (current_key == apikeys.length - 1) {
        current_key = 0;
      }
      else {
        current_key++;
      }
    }

    if (!error && res2.statusCode == 200) {
      data = JSON.parse(res2.body);
      var nutrients = data.report.food["nutrients"];
      return_data["name"] = data.report.food.name;
      for (var item in nutrients) {
        if (interested.indexOf(nutrients[item]["name"]) != -1) {
          return_data[nutrients[item]["name"]] = nutrients[item]["measures"][0]["value"];
        }
      }
      
      res.send(return_data);
    }
    else {
      console.log("Error in get_nutrition: " + error);
    }
  });
});

router.get('/add_list/:food', function(req, res, next) {
  var list_name = req.params.list;
  res.send('adds a food to the users list');
});

router.get('/get_list/:list', function(req, res, next) {
  var list_name = req.params.list;
  res.send('gets a users list');
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
