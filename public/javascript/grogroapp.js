// App Definition
var app = angular.module('grogro', ['ngRoute']);

// List Persistance
// Ensures lists stay when navigating different pages
app.service('listService', function() {
  var dbEntries = null;
  return{
    setEntries: function(entries) {
      dbEntries = entries;
    },
    getEntries: function() {
      return dbEntries;
    }
  };
});