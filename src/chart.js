
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

	var stockCharts = [];
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
				d3.select('.legend')
					.append('svg:circle')
					.attr('r', 5)
					.attr('cx', config.margin + 10 + key * 90)
					.attr('cy', 15)
					.attr('fill', serie.color)

				// legend text
				d3.select('.legend')
					.append('svg:text')
					.attr('x', config.margin + 10 + key * 90 + 9)
					.attr('y', 20)
					.attr('fill', '#666666')
					.text(serie.key)
					.style('font-size', '16px')
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
