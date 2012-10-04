
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

			var formatTime = d3.time.format(config.timeFormat),
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
