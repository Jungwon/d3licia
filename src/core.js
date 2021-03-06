
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