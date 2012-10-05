
d3licia.models.axis = function(options) {
	// ===================================================
	// Defaults values
	var defaults = {
		timestamp: false,
		tickFormat: ',.0f'
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

	return axis;

};
