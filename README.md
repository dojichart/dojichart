# DojiChart

[DojiChart](http://dojichart.com) is a JavaScript library for displaying candlestick charts and technical indicators using the canvas element.

## Install

npm install dojichart

## Features

- **Multiple chart panels** - A DojiChart instance comprises multiple chart panels, for example, a separate volume panel can be associated with a price chart panel.

- **Layers** - A chart panel has layers, for example a candlestick layer and moving average layer.

- **Size and spacing** - The width of candlesticks and their intervals can be changed on the fly - otherwise known as zoom.

- **Scrolling** - Charts can be scrolled forward and backward, either one bar at a time or by a specific number of time intervals.

- **Grid lines and labels** - Each chart panel can optionally have value and time grid lines and labels, which can be set to appear at specified granularity or automatically.

- **Crosshair** - A crosshair, implemented as a layer is rendered over each chart panel and reacts to mousemove events.

- **Events** - Click events on candlesticks is implemented and can be extended to cover other interaction events, such as touch and drag.


## Usage

Include the DojiChart CSS and JavaScript in the head of your HTML document:
```html
<head>
  ...
  <link rel="stylesheet" href="dojichart.min.css"/>
  <script type="text/javascript" src="dojichart.min.js"></script>
</head>
```

Provide an HTML container element:

```html
<body>
  <div class="dojichart" id="mychart">
    <div class="region" data-name="price"></div>
  </div>
</body>
```

Instantiate the DojiChart instance, create a panel, add a layer and load some data:

```javascript
var doji_chart = new DojiChart("mychart", {
  width: 700,
  fieldMap: {
    time: "t",
    open: "o",
    high: "h",
    low: "l",
    close: "c",
  }
});

// Create a chart panel in the region named 'price'
var price_chart_panel = doji_chart.createChartPanel("price", {
  name: "pricechart",
  height: 250
});

// Create candlestick layer, as part of the panel named 'pricechart' 
var candle_layer = doji_chart.createLayer("pricechart", "candle", {
  name: "candles"
});

// Dummy data
var data_arr = [
  {"t":"2015-11-11T17:25:00.000000Z","o":4672.3,"h":4675.3,"l":4671.0,"c":4671.4},
  {"t":"2015-11-11T17:30:00.000000Z","o":4671.5,"h":4675.1,"l":4671.3,"c":4674.5},
  {"t":"2015-11-11T17:35:00.000000Z","o":4674.5,"h":4678.6,"l":4674.5,"c":4676.2},
  {"t":"2015-11-11T17:40:00.000000Z","o":4676.0,"h":4677.3,"l":4674.5,"c":4674.9},
  {"t":"2015-11-11T17:45:00.000000Z","o":4674.7,"h":4676.2,"l":4673.2,"c":4673.3}
];

// Load data
doji_chart.loadData(data_arr, "M5");
```

## License

DojiChart is made available via the GNU General Public License version 3 (GPLv3). You are required to release the source code of any program that you distribute that uses DojiChart. If you would like to use the DojiChart source as part of commercial software or do not want disclose your source code, please get in [contact](http://dojichart.com#contact).
