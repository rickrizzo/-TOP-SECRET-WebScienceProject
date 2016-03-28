// Start Pages Correctly
app.filter('pages', function() {
  return function(input, start) {
    start = +start;
    return input.slice(start);
  }
});