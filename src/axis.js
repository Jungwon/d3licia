
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
