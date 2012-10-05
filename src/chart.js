
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
	})
	// ===================================================

	// ===================================================
	// Get x and y scales
	if (config.timestamp) {
		var xScale = d3.time.scale()
			.domain([xMin, xMax])
			.range([0, config.w])
			.ticks(d3.time.months, 6);
	} else {
		var xScale = d3.scale.linear()
			.domain([xMin, xMax])
			.range([0, config.w])
			//.ticks(config.xticks);
	}

	var yScale = d3.scale.linear()
		.domain([yMin, yMax])
		.range([config.h, 0])
		//.ticks(config.yticks);
	// ===================================================

	// ===================================================
	// Init lines and axis
	var xAxis = d3licia.models.axis({
		scale: xScale,
		timestamp: config.timestamp,
		timeFormat: '%H:%M',
		orient: 'bottom',
		ticks: config.xticks
	});

	var yAxis = d3licia.models.axis({
		scale: yScale,
		orient: 'left',
		ticks: config.yticks
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
