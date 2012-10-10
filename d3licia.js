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
		transform: ''
	};
	// ===================================================


	// ===================================================
	// Config values (= defaults + options) that will be used to draw chart
	var config = d3licia.utils.merge_options(defaults, options);
	// ===================================================


	// ===================================================
	// Format axis values for label if date
	if (config.timestamp) {
		var range = (config.scale.domain()[1] - config.scale.domain()[0]) / config.ticks;
		if (config.timeFormat) {
			var formatTime = d3.time.format(config.timeFormat);
		} else {
			switch (true) {
				// range < 1 minute
				case (range < 1000 * 60) :
					var formatTime = d3.time.format('%Hh%Mm%S');
				break;
				// < 1 day
				case (range < 1000 * 60 * 60 * 24) :
					var formatTime = d3.time.format('%Hh%M');
				break;
				// < 1 month
				case (range < 1000 * 60 * 60 * 24 * 31) :
					var formatTime = d3.time.format('%e / %m');
				// < 1 year
				case (range < 1000 * 60 * 60 * 24 * 31 * 12) :
					var formatTime = d3.time.format('%m / %Y');
				break;
				default:
					var formatTime = d3.time.format('%Y');
				break;
			}
		}
		var tickFormat = function(d) { return formatTime(new Date(d)); }; // TODO : Check this for other format than minutes
	} else {
		var tickFormat = d3.format(config.tickFormat);
	}
	// ===================================================


	var axis = d3.svg.axis()
		.scale(config.scale)
		.orient(config.orient)
		.ticks(config.ticks)
		.tickFormat(tickFormat);

	// append axis
	config.vis
		.append('g')
		.attr('class', 'axis')
		.attr('transform', config.transform)
		.call(axis);


	// append axis legend
	config.vis
		.append('svg:text')
		.text(config.x)

	return axis;

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
		timestamp: false,
		xticks: 10,
		yticks: 10
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

	// legend container
	var legend = d3.select(config.selector)
		.append('svg:svg')
		.attr('class', 'legend')
		.style('height', '30px')
		.style('width', config.width);

	// chart container
	var vis = d3.select(config.selector)
		.append('svg:svg')
		.attr('width', config.width)
		.attr('height', config.height)
		.append('svg:g')
		.attr('class', 'visu')
		.attr('transform', 'translate('+config.margin+','+config.margin+')');

	// ===================================================
	// Init lines and axis
	var xAxis = d3licia.models.axis({
		scale: xScale,
		timestamp: config.timestamp,
		orient: 'bottom',
		ticks: config.xticks,
		timeFormat: (config.timeFormat !== undefined) ? config.timeFormat : null,
		vis: vis,
		transform: 'translate(0, '+config.h+')'
	});

	var yAxis = d3licia.models.axis({
		scale: yScale,
		orient: 'left',
		ticks: config.yticks,
		vis: vis
	});
	// ===================================================

	var stockCharts    = [];
	var legend_padding = config.margin + 10;
	_.each(data, function(serie, key) {
		switch (serie.type) {
			case 'line':
				var line = d3.svg.line()
					.x(function(d) { return xScale(d.x); })
					.y(function(d) { return yScale(d.y); })
					.interpolate((serie.interpolation !== undefined) ? serie.interpolation : 'linear');

				vis.selectAll('.line_'+key)
					.data([serie.values])
					.enter()
					.append('svg:path')
					.attr('d', line)
					.attr('fill', 'none')
					.attr('stroke-width', '2')
					.attr('stroke', serie.color);

				// legend
				var g = d3.select('.legend')
					.append('g')

				g.append('svg:line')
					.attr('x1', legend_padding - 5)
					.attr('y1', 15)
					.attr('x2', legend_padding + 5)
					.attr('y2', 15)
					.attr('stroke', serie.color)
					.attr('stroke-width', 3)

				// legend text
				g.append('svg:text')
					.attr('x', legend_padding + 9)
					.attr('y', 20)
					.attr('fill', '#666666')
					.text(serie.key)
					.style('font-size', '15px')

				legend_padding += g[0][0].getBoundingClientRect().width + 20;
		break;
		case 'area':
				// area
				var area = d3.svg.area()
					.x(function(d) { return xScale(d.x); })
					.y0(function(d) { return config.h; })
					.y1(function(d) { return yScale(d.y); })
					.interpolate((serie.interpolation !== undefined) ? serie.interpolation : 'linear');

				vis.selectAll('.area_'+key)
					.data([serie.values])
					.enter()
					.append('svg:path')
					.attr('class', 'area')
					.attr('d', area)
					.attr('fill', serie.color)
					.attr('opacity', (serie.opacity !== undefined) ? serie.opacity : 0.8);

				// stroke
				var stroke = d3.svg.line()
					.x(function(d) { return xScale(d.x); })
					.y(function(d) { return yScale(d.y); })
					.interpolate((serie.interpolation !== undefined) ? serie.interpolation : 'linear');

				vis.selectAll('.area-stroke')
					.data([serie.values])
					.enter()
					.append('svg:path')
					.attr('d', stroke)
					.attr('fill', 'none')
					.attr('stroke-width', '1')
					.attr('opacity', 1)
					.attr('stroke', serie.color);

				// legend
				var g = d3.select('.legend')
					.append('g')

				g.append('svg:circle')
					.attr('r', 5)
					.attr('cx', config.margin + 10 + key * 90)
					.attr('cy', 15)
					.attr('fill', serie.color)

				// legend text
				g.append('svg:text')
					.attr('x', config.margin + 10 + key * 90 + 9)
					.attr('y', 20)
					.attr('fill', '#666666')
					.text(serie.key)
					.style('font-size', '15px')

					legend_padding += g[0][0].getBoundingClientRect().width + 20;
		break;
		}
	})

	// var lineCursor = vis.append('svg:line')
	// 	.attr('x1', 0)
	// 	.attr('y1', 0)
	// 	.attr('x2', 0)
	// 	.attr('y2', 0)
	// 	.attr('style', 'z-index: 10')

	// d3.select('svg')
	// 	.on('mousemove', function() {
	// 		var coords = d3.mouse(document.getElementsByClassName('visu')[0]);
	// 		if (coords[0] > 0 && coords[1] > 0 && coords[0] < config.w && coords[1] < config.h) {
	// 			lineCursor.attr('x1', coords[0])
	// 				.attr('y1', 0)
	// 				.attr('x2', coords[0])
	// 				.attr('y2', config.h)
	// 				.attr('style', 'stroke:rgb(100,100,100);stroke-width: 1;');
	// 		} else {
	// 			lineCursor.attr('x1', 0)
	// 				.attr('y1', 0)
	// 				.attr('x2', 0)
	// 				.attr('y2', 0)
	// 			}
	// 	})
};

})();