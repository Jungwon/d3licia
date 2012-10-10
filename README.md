d3licia is a chart library using d3js

##How to use##
Include d3licia in your html page after have added its dependencies which are underscorejs and d3js
So :

    <script src="/Users/kevinchavanne/www/d3licia/lib/underscore-min.js"></script>
    <script src="/Users/kevinchavanne/www/d3licia/lib/d3.v2.min.js"></script>
    <script src="/Users/kevinchavanne/www/d3licia/d3licia.min.js"></script>

Then you can use d3licia, and instanciate a chart with

    d3licia.addGraph(function() {
        d3licia.models.chart(data, options);
    });

Chart is a model that draw area or line chart for sets of data.

2 arguments are necessary to construct chart : `data` and `options`

Data is an array containing severals datasets. eg:
```json
[
  {
    "key" : "Stream 1",
    "type" : "area",
    "color": "#ababab",
    "opacity": 0.5,
    "interpolation": "linear",
    "values": [
      {"x": 1025409600000, "y": 7.9356392949025},
      {"x": 1028088000000, "y": 7.4514668527298}
    ]
  },
  {
    "key" : "Stream 2",
    "type" : "line",
    "color": "#ccccc",
    "opacity": 0.8,
    "interpolation": "basis",
    "values": [
      {"x": 1025409600000, "y": 8.9356392949025},
      {"x": 1028088000000, "y": 9.4514668527298}
    ]
  }
]
```

Since all datasets are drown in the same chart, x axis must be on the same domain.

Options is a javascript Object containing some options which are :

```javascript
var options = {
  	selector: '#chart',
		timestamp: true,
		xticks: 10,
		yticks: 10,
		timeFormat: '%Y',
		margin: 20
	};
```

* selector is the div where you want to draw the chart. This div must have width and height specified.
* timestamp (optionnal, default false) is set to true when x axis values are timestamps. This will transform timestamps to corresponding dates for x labels
* xticks (optionnal, default 10) is the number of x ticks you want to show
* yticks (optionnal, default 10) idem for y axis
* timeFormat (optionnal) is the format to show timestamp dates (see d3 format for more informations)
* margin (optionnal, default 20) is the margin size on sides of chart. In this margin will be shown axis and axis labels