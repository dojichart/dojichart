# DojiChart

[DojiChart](http://dojichart.com) is a JavaScript library for displaying candlestick charts and technical indicators using the canvas element.

## Install

```
npm install dojichart
```

## Features

- **Multiple chart panels** - A DojiChart instance comprises multiple chart panels, for example, a separate volume panel can be associated with a price chart panel.

- **Layers** - A chart panel has layers, for example a candlestick layer and moving average layer.

- **Responsive** - Charts are responsive, such that they expand or contract to fit their container's width.

- **Size and spacing** - The width of candlesticks and their intervals can be changed on the fly - this is equivalent to zooming.

- **Scrolling** - Charts can be scrolled forward and backward, either one bar at a time or by a specific number of time intervals.

- **Grid lines and labels** - Each chart panel can optionally have value and time grid lines and labels, which can be set to appear at specified granularity or automatically.

- **Crosshair** - A crosshair, implemented as a layer is rendered over each chart panel and reacts to mousemove events.

- **Events** - Click events on candlesticks is implemented and can be extended to cover other interaction events, such as touch and drag.


## Usage

Include the DojiChart CSS and JavaScript in the head of your HTML document:
```html
<link rel="stylesheet" href="dojichart.min.css">
<script type="text/javascript" src="dojichart.min.js"></script>
```

Provide an HTML container element:

```html
<div class="dojichart" id="mychart">
  <div class="region" data-name="price"></div>
</div>
```

Instantiate the DojiChart instance, create a panel, add a layer and load some data:

```javascript
var dojichart = new DojiChart.core.Chart(document.getElementById('mychart'), {
  fieldMap: {
    time: 't',
    open: 'o',
    high: 'h',
    low: 'l',
    close: 'c'
  }
});

// Create a chart panel with a candlestick chart layer
var price_chart_panel = new DojiChart.panel.TimeValuePanel({
  primaryLayer: new DojiChart.layer.CandleLayer(),
  height: 200
});

// Render the panel in the region named 'price'
dojichart.addComponent('price', price_chart_panel);

// Dummy data
var data_arr = [
  {'t':'2015-11-11T17:25:00.000000Z','o':4672.3,'h':4675.3,'l':4671.0,'c':4671.4},
  {'t':'2015-11-11T17:30:00.000000Z','o':4671.5,'h':4675.1,'l':4671.3,'c':4674.5},
  {'t':'2015-11-11T17:35:00.000000Z','o':4674.5,'h':4678.6,'l':4674.5,'c':4676.2},
  {'t':'2015-11-11T17:40:00.000000Z','o':4676.0,'h':4677.3,'l':4674.5,'c':4674.9},
  {'t':'2015-11-11T17:45:00.000000Z','o':4674.7,'h':4676.2,'l':4673.2,'c':4673.3}
];

// Load data
dojichart.loadData(data_arr, 'EURUSD', 'M5');
```

## License

DojiChart is made available via the GNU General Public License version 3 (GPLv3). You are required to release the source code of any program that you distribute that uses DojiChart. If you would like to use the DojiChart source as part of commercial software or do not want disclose your source code, please get in [contact](http://dojichart.com#contact).
