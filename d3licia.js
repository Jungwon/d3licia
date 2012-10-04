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

d3licia.models.axis = function(options) {
	// ===================================================
	// Defaults values
	var defaults = {
		timestamp: false,
		tickFormat: ',.0f',
		timeFormat: ''
	};
	// ===================================================


	// ===================================================
	// Config values (= defaults + options) that will be used to draw chart
	var config = d3licia.utils.merge_options(defaults, options);
	// ===================================================


	// ===================================================
	// Format axis values for label if date
	if (config.timestamp) {
		var test = function(d) {
			console.log(d);
		}
		console.log(config.scale.domain());
		var formatCount = d3.format(tickFormat),
			formatTime = d3.time.format(config.timeFormat),
			tickFormat = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); }; // TODO : Check this for other format than minutes
	} else {
		var tickFormat = d3.format(config.tickFormat);
	}
	// ===================================================


	var axis = d3.svg.axis()
		.scale(config.scale)
		.orient(config.orient)
		.ticks(10)
		.tickFormat(tickFormat);

	return axis;


	// Formatters for counts and times (converting numbers to Dates).
	// var formatCount = d3.format(",.0f"),
	// 		formatTime = d3.time.format("%H:%M"),
	// 		formatMinutes = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); };

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
		margin: 20,
		timestamp: false
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
		var x_min = d3.min(serie.values, function(d) { return d.x; });
		var x_max = d3.max(serie.values, function(d) { return d.x; });
		xMin = (xMin === null || xMin > x_min) ? x_min : xMin;
		xMax = (xMax === null || xMax < x_max) ? x_max : xMax;
	});
	// yMin and yMax
	var yMax = null, yMin = null;
	_.each(data, function(serie) {
		var y_min = d3.min(serie.values, function(d) { return d.y; });
		var y_max = d3.max(serie.values, function(d) { return d.y; });
		yMin = (yMin === null || yMin > y_min) ? y_min : yMin;
		yMax = (yMin === null || yMax < y_max) ? y_max : yMax;
	});
	// ===================================================

	// ===================================================
	// Get x and y scales
	var xScale = d3.scale.linear()
		.domain([xMin, xMax])
		.range([0, config.w]);

	var yScale = d3.scale.linear()
		.domain([yMin, yMax])
		.range([config.h, 0]);
	// ===================================================

	// ===================================================
	// Init lines and axis
	var xAxis = d3licia.models.axis({
		scale: xScale,
		timestamp: config.timestamp,
		timeFormat: '%H:%M',
		orient: 'bottom'
	});

	var yAxis = d3licia.models.axis({
		scale: yScale,
		orient: 'left'
	});
	// ===================================================


	var vis = d3.select(config.selector)
		.append('svg:svg')
		.attr('width', config.width)
		.attr('height', config.height)
		.append('svg:g')
		.attr('transform', 'translate('+config.margin+','+config.margin+')');

	vis.append('g')
		.attr('class', 'axis')
		.attr('transform', 'translate(0, '+config.h+')')
		.call(xAxis);

	vis.append('g')
		.attr('class', 'axis')
		.call(yAxis);

	_.each(data, function(serie) {
		switch (serie.type) {
			case 'bar':
			break;
			case 'line':
				var line = d3.svg.line()
					.x(function(d) {return xScale(d.x);})
					.y(function(d) { return yScale(d.y);})
					.interpolate((serie.interpolation !== undefined) ? serie.interpolation : 'linear');

				vis.selectAll('.chart')
					.data([serie.values])
					.enter()
					.append("svg:path")
					.attr("d", line)
					.attr('fill', 'none')
					.attr('stroke-width', '2')
					.attr('stroke', serie.color);
	    break;
		}
	})
};

})();