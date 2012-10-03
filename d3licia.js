(function(){
var d3licia = {
	version: '0.0.1a',
	dev: true
};

window.d3licia = d3licia;

//d3licia.tooltip = {}; // For the tooltip system
d3licia.utils   = {}; // Utility subsystem
d3licia.models  = {}; // stores all the possible models/components
//d3licia.charts  = {}; // stores all the ready to use charts
d3licia.graphs  = []; // stores all the graphs currently on the page
//d3licia.logs    = {}; // stores some statistics and potential error messages

d3licia.addGraph = function(closure, options) {
	d3licia.graphs.push(closure);
	d3licia.render();
};

d3licia.render = function() {
	_.each(d3licia.graphs, function(callback) {
		callback();
	})
}

window.onresize = function(event) {
    d3licia.render();
}
/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
d3licia.utils.merge_options = function(obj1, obj2) {
	var obj3 = {};
	for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
	for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
	return obj3;
};

d3licia.models.axis = function(data, scale) {
	// ===================================================
	// Defaults values
	// var defaults = {
	// 	selector: '#graph',
	// 	margin: 0
	// };
	// ===================================================


	// ===================================================
	// Config values (= defaults + options) that will be used to draw chart
	// var config = d3licia.utils.merge_options(defaults, options);
	// ===================================================


	// ===================================================
	// Config values (= defaults + options) that will be used to draw chart
	//config.scale = d3licia.utils.merge_options(defaults, options);
	// ===================================================
var axis = d3.svg.axis()
	.scale(scale)
	.orient('bottom')

	// vis.append("svg:path")
	// 	.attr("class", "line")
	// 	.attr("d", d3.svg.line()
	// 	.x(function(d) { return x(d.x); })
	// 	.y(function(d) { return y(d.y); }))
	// 	.attr('fill', 'none')

	// d3.select(config.selector)
	// 	.append("svg:svg")
	// 	.data([data])
	// 	.attr("width", w + p * 2)
	// 	.attr("height", h + p * 2)
	// 	.append("svg:g")
	// 	.attr("class", "test")
	// 	.attr("transform", "translate(" + p + "," + p + ")")
};

d3licia.models.line = function(data, options) {
	// ===================================================
	// Defaults values
	var defaults = {
		selector: '#graph',
		margin: 0
	};
	// ===================================================


	// ===================================================
	// Config values (= defaults + options) that will be used to draw chart
	var config = d3licia.utils.merge_options(defaults, options);
	// ===================================================

	// vis.append("svg:path")
	// 	.attr("class", "line")
	// 	.attr("d", d3.svg.line()
	// 	.x(function(d) { return x(d.x); })
	// 	.y(function(d) { return y(d.y); }))
	// 	.attr('fill', 'none')

	// d3.select(config.selector)
	// 	.append("svg:svg")
	// 	.data([data])
	// 	.attr("width", w + p * 2)
	// 	.attr("height", h + p * 2)
	// 	.append("svg:g")
	// 	.attr("class", "test")
	// 	.attr("transform", "translate(" + p + "," + p + ")")
};

// d3licia.models.legend = function() {
// 	return null;
// };

d3licia.models.chart = function(data, options) {

	// ===================================================
	// Defaults values
	var defaults = {
		selector: '#graph',
		margin: 20
	};
	// ===================================================


	// ===================================================
	// Config values (= defaults + options) that will be used to draw chart
	var config    = d3licia.utils.merge_options(defaults, options);
	config.width  = parseInt(d3.select(options.selector).style('width')); // global width
	config.height = parseInt(d3.select(options.selector).style('height')); // global height
	config.w      = config.width - 2 * config.margin; // visu width (global - margins)
	config.h      = config.height - 2 * config.margin; // visu height (global - margins)
	// ===================================================

	// ===================================================
	// Reinitialize selector (to avoir multiple charts appended to same selector)
	d3.select(config.selector).html('');
	// ===================================================

	// ===================================================
	// Get min and max values
	// xMin and xMax
	var xMax = null, xMin = null;
	_.each(data, function(serie) {
		var x_min = d3.min(serie.values, function(d) { return d[0]; });
		var x_max = d3.max(serie.values, function(d) { return d[0]; });
		xMin = (xMin === null || xMin > x_min) ? x_min : xMin;
		xMax = (xMax === null || xMax < x_max) ? x_max : xMax;
	});
	// yMin and yMax
	var yMax = null, yMin = null;
	_.each(data, function(serie) {
		var y_min = d3.min(serie.values, function(d) { return d[1]; });
		var y_max = d3.max(serie.values, function(d) { return d[1]; });
		yMin = (yMin === null || yMin > y_min) ? y_min : yMin;
		yMax = (yMin === null || yMax < y_max) ? y_max : yMax;
	});
	// ===================================================

	// ===================================================
	// Get x and y scales
	var xScale = d3.scale.linear()
		.domain([0, data[0].values.length])
		.range([0, config.w])

	var yScale = d3.scale.linear()
		.domain([yMin, yMax])
		.range([config.h, 0])
	// ===================================================


	// ===================================================
	// Init lines and axis
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.ticks(10);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.ticks(10);
	// ===================================================


	var vis = d3.select(config.selector)
		.append('svg:svg')
		.attr('width', config.width)
		.attr('height', config.height)
		.append('svg:g')
		.attr('transform', 'translate('+config.margin+','+config.margin+')')

	vis.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate(0, '+config.h+')')
		.call(xAxis)

	vis.append('g')
		.attr('class', 'axis')
		.call(yAxis)







	// Formatters for counts and times (converting numbers to Dates).
	// var formatCount = d3.format(",.0f"),
	// 		formatTime = d3.time.format("%H:%M"),
	// 		formatMinutes = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); };

	// var margin = {top: 30, right: 30, bottom: 30, left: 30},
	// 		width = 1000 - margin.left - margin.right,
	// 		height = 300 - margin.top - margin.bottom;

	// ===================================================
	// Init lines and axis

	// var yAxis = d3licia.models.axis(function(data, config) {
	// 	//
	// })
	// var yLine = d3licia.models.line(function(data, options) {
	// 	//
	// })
	// var xLine = d3licia.models.line(function(data, options) {
	// 	//
	// })
	// ===================================================
// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom")
//     .tickFormat(formatMinutes);

// var max = d3.max(data, function(d) {return d.y;});

// var w = 800,
//     h = 400,
//     p = 20,
//     x = d3.scale.linear().domain([0, data.length]).range([0, w]),
//     y = d3.scale.linear().domain([0, d3.max(data, function(d) {return (d.y) + (0.5 * d.y);})]).range([h, 0]);

// var vis = d3.select("#audience-chart")
//   .append("svg:svg")
//     .data([data])
//     .attr("width", w + p * 2)
//     .attr("height", h + p * 2)
//   .append("svg:g")
//     .attr("class", "test")
//     .attr("transform", "translate(" + p + "," + p + ")")
//     //.attr('class', 'global')

// var rules = vis.selectAll("g.rule")
//     .data(x.ticks(10))
//   .enter().append("svg:g")
//     .attr("class", "rule");

// // X axis
// rules.append("svg:text")
//     .attr("x", x)
//     .attr("y", h + 3)
//     .attr("dy", ".71em")
//     .attr("text-anchor", "middle")
//     .text(x.tickFormat(10));

// // Y Axis
// var y_axis = vis.selectAll('y_axis')
//     .data(y.ticks(10)).enter()
//     .append("svg:text")
//     .attr("dy", ".35em")
//     .attr('x', 10)
//     .attr('y', function(d) { return y(d); })
//     .text(function(d) { return ((d !== 0) ? d : ''); })
//     .attr("text-anchor", "end")
//     .attr('class', 'y_axis')

// // Engagement path
// vis.append("svg:path")
//     .attr("class", "area")
//     .attr("d", d3.svg.area()
//     .x(function(d) { return x(d.x); })
//     .y0(h - 1)
//     .y1(function(d) { return y(d.y); }))
//     .attr('fill', '#1F77B4')
//     .attr('opacity', '0.5')

// // Reach path
// vis.append("svg:path")
//     .attr("class", "area_2")
//     .attr("d", d3.svg.area()
//     .x(function(d) { return x(d.x); })
//     .y0(h - 1)
//     .y1(function(d) { return y(d.z); }))
//    	.attr('opacity', '0.5')
//    	.attr('fill', '#1F77B4')

// // Line (to draw svg path's stroke) for Engagement
// vis.append("svg:path")
//     .attr("class", "line")
//     .attr("d", d3.svg.line()
//     .x(function(d) { return x(d.x); })
//     .y(function(d) { return y(d.y); }))
//     .attr('fill', 'none')
//     .attr('stroke', '#1F77B4')
//     .attr('stroke-width', '1')

// // Line (to draw svg path's stroke) for Reach
// vis.append("svg:path")
//     .attr("class", "line")
//     .attr("d", d3.svg.line()
//     .x(function(d) { return x(d.x); })
//     .y(function(d) { return y(d.z); }))
//     .attr('fill', 'none')
//     .attr('stroke', '#1F77B4')
//     .attr('stroke-width', '1')

// // Line number of tweetos
// vis.append("svg:path")
//     .attr("class", "line")
//     .attr("d", d3.svg.line()
//     .x(function(d) { return x(d.x); })
//     .y(function(d) { return y(d.z * 0.2); }))
//     .attr('fill', 'none')
//     .attr('stroke', '#FF7F0E')
//     .attr('stroke-width', '2')

// // Legend Reach text
// vis.append("svg:text")
// 	.attr("x", 650)
// 	.attr("y", 10)
// 	.text('Couverture')
// 	.attr('fill', '#666')

// // Legent Reach circle
// vis.append("svg:circle")
// 	.attr('cx', 630)
// 	.attr('cy', 6)
// 	.attr('r', 5)
// 	.attr('fill', '#8FBBDA')

// // Legend Engagement Text
// vis.append("svg:text")
// 	.attr("x", 650)
// 	.attr("y", 30)
// 	.text('Tweets')
// 	.attr('fill', '#666')

// // Legend Engagement circle
// vis.append("svg:circle")
// 	.attr('cx', 630)
// 	.attr('cy', 26)
// 	.attr('r', 5)
// 	.attr('fill', '#5799C7')

// // Legend Number of tweetos Text
// vis.append("svg:text")
// 	.attr("x", 650)
// 	.attr("y", 50)
// 	.text('Nombre de tweetos actifs')
// 	.attr('fill', '#666')

// // Legend Number of tweetos line
// vis.append("svg:line")
// 	.attr('x1', 625)
// 	.attr('y1', 46)
// 	.attr('x2', 635)
// 	.attr('y2', 46)
// 	.attr('stroke', '#FF7F0E')
// 	.attr('stroke-width', 2)

};

})();