var express = require('express');
var router = express.Router();
var request = require('request');
var itemCtrl = require('../controllers/itemCtrl');
var listCtrl = require('../controllers/listCtrl');

var apikeys = ['c7cIi88CYsXPaT1sxqhLSLz2OaROEEOdjFFHff79', 'BD5eu8hQLzoGG2jmEjkF4EBhT9HU4uEeJcjFz9oW', 'CSnXW6BKcazu7RgncwWKqLCGzodQNDxWLm1Q0VP3'];

var current_key = 0;


// Get entries from USDA API based on Food String Name
router.get('/get_food/:food', function(req, res, next) {
  var food = req.params.food;
  var return_data = {};
  var data = null;

  if (current_key == apikeys.length) {
    current_key = 0;
  }

  // make the request to the USDA database
  request('http://api.nal.usda.gov/ndb/search/?format=json&q=' + food + '&sort=r&offset=0&api_key=' + apikeys[current_key], function (error, res1, body) {
    // cycle through API keys if one is expired
    if (res1.caseless.dict["x-ratelimit-remaining"] <= 20) {
      if (current_key == apikeys.length - 1) {
        current_key = 0;
      }
      else {
        current_key++;
      }
    }

    // return the data we care about - name and id
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

// gets nutrition information from USDA based on food ID
router.get('/get_nutrition/:food_id', function(req, res, next) {
  var food = req.params.food_id;
  // nutrition information we care about
  var interested = ["Energy", "Sugars, total", "Total lipid (fat)", "Carbohydrate, by difference", "Fiber, total dietary"];
  var return_data = {};

  // make the request to the USDA database
  request('http://api.nal.usda.gov/ndb/reports/?ndbno=' + food + '&type=b&format=json&api_key=' + apikeys[current_key], function(error, res2, body) {
    // cycle through API keys if one is expired
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
      // go through nutrition and only return data we care about
      for (var item in nutrients) {
        if (interested.indexOf(nutrients[item]["name"]) != -1) {
          if(nutrients[item]["measures"].length <= 0) {
            return_data[nutrients[item]["name"]] = nutrients[item]["value"];
          } else {
            return_data[nutrients[item]["name"]] = nutrients[item]["measures"][0]["value"];
          }
        }
      }
      res.send(return_data);
      itemCtrl.findOrCreate({api_id: food, nutrition: return_data});
    }
    else {
      console.log("Error in get_nutrition: " + error);
    }
  });
});

// gets an item from the database
router.get('/get_item/:id', function(req, res, next){
  var api_id = req.params.id;
  itemCtrl.findOrCreate({api_id: api_id}, res);
});

// adds an item to a food list in the database
router.get('/add_list/:list/:food_id', function(req, res, next) {
  var food_id = req.params.food_id;
  var list = req.params.list;
  listCtrl.addItem({name: list, api_id: food_id, user_id: req.cookies.user}, res);
});
var hold = [];

// shows a users lists
router.get('/show_lists', function(req, res,next){
  listCtrl.showAllLists({user_id: req.cookies.user}, res);
});

// gets a users list
router.get('/get_list', function(req, res, next) {
  listCtrl.findOrCreate({name: "TestList", user_id: req.cookies.user},res);
});

// creates a list and initializes it with food entries
router.post('/create_list', function(req, res, next) {
  var list = req.body.list;
  var name = req.body.name;
  console.log(req.cookies.user);
  listCtrl.findOrCreate({name: name, user_id: req.cookies.user});
  //listCtrl.findOrCreate(req, res);
  for (var item in list) {
    console.log(list[item]["id"]);
    listCtrl.addItem({name: name, api_id: list[item]["id"], user_id: req.cookies.user});
  }
  res.send('added list to db');
});

// deletes a users list
router.get('/del_list/:list', function(req, res, next) {
  var list = req.params.list;
  listCtrl.delete({name: list_name, user_id: req.cookies.user});
  res.send('deletes a users list');
});

module.exports = router;
