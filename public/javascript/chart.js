// Data for Chart
var data = [4, 8, 15, 16, 23, 42];

// Create Chart Div
d3.select('body').append('div').attr('class', 'chart');

// Scale Widths
// var x = d3.scale.linear().domain([0, d3.max(data)]).range([0, 400]);

// // Append Chart Bars
// d3.select('.chart').selectAll("div")
//     .data(data).enter().append("div")
//     .style("width", function(d) { return x(d) + "px"; })
//     .text(function(d) { return d; });