var express = require('express');
var router = express.Router();
var request = require('request');

// Get Food
router.get('/get_food/:food', function(req, res, next) {
  var food = req.params.food;
  var return_data = {};
  var data = null;

  request('http://api.nal.usda.gov/ndb/search/?format=json&q=' + food + '&sort=r&offset=0&api_key=DEMO_KEY', function (error, res1, body) {
    if (!error && res1.statusCode == 200) {
      data = JSON.parse(res1.body);
      for (var item in data.list.item) {
        return_data[data.list.item[item]["name"]] = data.list.item[item]["ndbno"];
      }
      res.send(return_data);
    }
    else {
      res.status(500).send("Invalid food query!");
    }
  });
});

router.get('/get_nutrition/:food_id', function(req, res, next) {
  var food = req.params.food_id;
  var interested = ["Energy", "Sugars, total", "Total lipid (fat)", "Carboydrate, by difference", "Fiber, total dietary"];
  var return_data = {};

  request('http://api.nal.usda.gov/ndb/reports/?ndbno=' + food + '&type=b&format=json&api_key=DEMO_KEY', function(error, res2, body) {
    if (!error && res2.statusCode == 200) {
      data = JSON.parse(res2.body);
      var nutrients = data.report.food["nutrients"];
      return_data["name"] = data.report.food.name;
      for (var item in nutrients) {
        if (interested.indexOf(nutrients[item]["name"]) != -1) {
          return_data[nutrients[item]["name"]] = nutrients[item]["value"];
        }
      }
      
      res.send(return_data);
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

// Messenger Testing
router.get('/webhook/', function(req, res, next) {
  if (req.query['hub.verify_token'] === 'fancy_cashew') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

router.post('/webhook/', function(req, res, next) {
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

var token = "CAADjDHXZBZA10BAKirERca34b6v6GLfgoUbHZCZCcz6k3TESSqjSe9sF6kFBkEjgNhfWh0zr6DpmOsZAS98ZA5dlqLz3KlJh2cZAAj1XNRH1yjO3fDZCvsg7apphG6XX5uIf98Xh6uY2jFOtO6IQPglBDkKO3fZB8bvEN9XxZAoIcodiqxBGZBQ3to9eh5ajCFviLFITvSgM1ZAAGQZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

module.exports = router;
