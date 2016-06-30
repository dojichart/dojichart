
var dojichart = new DojiChart.core.Chart(document.getElementById("my-dojichart"), {
  fieldMap: {
    time: "time",
    open: "openBid",
    high: "highBid",
    low: "lowBid",
    close: "closeBid",
    volume: "volume"
  },
  crosshair: true
});

// Price
var price_chart_panel = new DojiChart.panel.TimeValuePanel({
  primaryLayer: new DojiChart.layer.CandleLayer({}),
  height: 200,
  grid: true
});

dojichart.addComponent("price", price_chart_panel);

// SMA 200
var sma200_layer = new DojiChart.layer.indicator.SimpleMovingAverageLayer({
  period: 200,
  color: "blue"
});
price_chart_panel.addLayer(sma200_layer);

// SMA 50
var sma50_layer = new DojiChart.layer.indicator.SimpleMovingAverageLayer({
  period: 50,
  color: "orange"
});
price_chart_panel.addLayer(sma50_layer);

// EMA 10
var ema10_layer = new DojiChart.layer.indicator.ExponentialMovingAverageLayer({
  period: 10,
  color: "fuchsia"
});
price_chart_panel.addLayer(ema10_layer);

// Bollinger Bands
var bb_layer = new DojiChart.layer.indicator.BollingerBandsLayer({
  midColor: "rgba(0, 128, 0, 0.4)",
  bandColor: "rgba(0, 0, 0, 0.3)" 
});
price_chart_panel.addLayer(bb_layer);

// Volume profile
var volume_profile_layer = new DojiChart.layer.indicator.VolumeProfileLayer({
});
price_chart_panel.addLayer(volume_profile_layer);

// Time labels (at top of chart)
var time_labels_panel = new DojiChart.panel.TimeLabelsPanel();
dojichart.addComponent("timelabels", time_labels_panel);

// Volume panel
var volume_chart_panel = new DojiChart.panel.TimeValuePanel({
  height: 100,
  primaryAtBack: true,
  primaryLayer: new DojiChart.layer.indicator.VolumeLayer({
    layerIndex: 1,
    barColor: "#3377FF",
    barWidth: 5
  })
});

dojichart.addComponent("volume", volume_chart_panel, true); // true to refresh layout - ensure region instance is created

// Volume EMA 65
var ema65_layer = new DojiChart.layer.indicator.ExponentialMovingAverageLayer({
  layerIndex: 2,
  input: "volume",
  period: 65,
  color: "black"
});
volume_chart_panel.addLayer(ema65_layer);

// Stochastic panel
var stochastic_chart_panel = new DojiChart.panel.TimeValuePanel({
  height: 68,
  grid: {
    value: {
      lines: [20, 50, 80]
    }
  },
  primaryLayer: new DojiChart.layer.indicator.StochasticLayer({
  })
});

dojichart.addComponent("stochastic", stochastic_chart_panel, true); // true to refresh layout - ensure region instance is created

// RSI panel
var rsi_chart_panel = new DojiChart.panel.TimeValuePanel({
  height: 68,
  grid: {
    value: {
      lines: [30, 70]
    }
  },
  primaryLayer: new DojiChart.layer.indicator.RSILayer({
  })
});

dojichart.addComponent("rsi", rsi_chart_panel, true); // true to refresh layout - ensure region instance is created


var load_data = function() {
  var symbol = $("select").val();
  var gran = $("button.btn-gran.active").data("value");

  var dat = data[symbol][gran];
  dojichart.loadData(dat.candles, symbol, gran);
  print_api_call("dojichart.loadData(data, '" + symbol + "', '" + gran + "')");
};

function print_api_call(str) {
  $("#api-print").text(str);
}

var btn_actions = {
  "refresh": function(btn, arg) {
    load_data();
  },
  "gran": function(btn, arg) {
    $("button.btn-gran").removeClass("active");
    btn.addClass("active");
    load_data();
  },
  "scroll": function(btn, arg) {
    var current_val = dojichart.getOffset();
    dojichart.scroll(current_val + parseInt(arg), false);
    print_api_call("dojichart.scroll(" + (current_val + parseInt(arg)) + ", false)");
  }
};

$("button").click(function(e) {
  var btn = $(e.target);
  var button_class = e.target.className;
  btn_actions[button_class.replace("btn-", "").replace("active", "").replace(" ", "")](btn, btn.data("value"));
});

$("select").change(function(e) {
  var select_value = e.target.value;
  load_data();
});

load_data();
