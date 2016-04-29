var app = angular.module('grogro', ['ngRoute']);

app.service('listService', function() {
  var dbEntries = {};
  return{
    setEntries: function(entries) {
      dbEntries = entries;
    },
    getEntries: function() {
      return dbEntries;
    }
  };
});