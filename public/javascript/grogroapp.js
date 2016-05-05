var app = angular.module('grogro', ['ngRoute']);

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

app.service('loginService', function() {
  var loggedIn = false;
  var name = '';
  return {
    setLoginStatus: function(_name) {
      if(name != '' && name != null) {
        this.name = _name;
        console.log(_name);
        loggedIn = true;
      }
    },
    getLoginName: function() {
      return this.name;
    },
    getLoginStatus: function() {
      return false;
    }
  };
});