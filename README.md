# [GRO GRO](https://grogro.herokuapp.com) [![Build Status](https://travis-ci.org/rickrizzo/GroGro.svg?branch=master)](https://travis-ci.org/rickrizzo/GroGro)
A health conscious grocery list creatd on the MEAN stack, GroGro uses the USDA food lookup API to provide valuable nutrition information on a myriad of foods. This data is then visualized and summarized for simple consumption by the user.

## GroGro API
* /get_food/:food
* /get\_nutrition/:food\_id
* /create_list

## Dev Tools
When editing styling, run the included 'watch-css' script for a better workflow. Invoke the script using `npm run watch-css` in the terminal.  
Additionally, deployments can be automated through the use of Nodemon (included in Dev dependencies). Invoke this by typing `nodemon grogro` in the terminal.

## Services
[USDA Nutrition Database](https://ndb.nal.usda.gov/ndb/api/doc)
