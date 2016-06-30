
// Chart
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

// Candlestick layer
var candle_layer = new DojiChart.layer.CandleLayer({});

// Price chart panel
var price_chart_panel = new DojiChart.panel.TimeValuePanel({
  primaryLayer: candle_layer,
  height: 250,
  grid: true
});

dojichart.addComponent("price", price_chart_panel);

// Moving average
var sma_layer = new DojiChart.layer.indicator.SimpleMovingAverageLayer({
  period: 50
});
price_chart_panel.addLayer(sma_layer);

// Time labels (at top of chart)
var time_labels_panel = new DojiChart.panel.TimeLabelsPanel();
dojichart.addComponent("timelabels", time_labels_panel);

// Volume
var volume_layer = new DojiChart.layer.indicator.VolumeLayer({
  barColor: "#3377FF",
  barWidth: 5
});

var volume_chart_panel = new DojiChart.panel.TimeValuePanel({
  height: 100,
  primaryLayer: volume_layer
});
dojichart.addComponent("volume", volume_chart_panel);

function load_data() {
  var symbol = $("select").val();
  var gran = $("button.btn-gran.active").data("value");

  var dat = data[symbol][gran];
  dojichart.loadData(dat.candles, symbol, gran);
  print_api_call("dojichart.loadData(data, '" + symbol + "', '" + gran + "')");
}

function print_api_call(str) {
  $("#api-print").text(str);
}

// Handle button click events
var btn_actions = {
  "gran": function(btn, arg) {
    $("button.btn-gran").removeClass("active");
    btn.addClass("active");
    load_data();
  },
  "intervaldecr": function(btn) {
    var current_val = dojichart.getIntervalWidth();
    dojichart.setIntervalWidth(current_val - 1);
    dojichart.draw();
    print_api_call("dojichart.setIntervalWidth(" + (current_val - 1) + ")");
  },
  "intervalincr": function(btn) {
    var current_val = dojichart.getIntervalWidth();
    dojichart.setIntervalWidth(current_val + 1);
    dojichart.draw();
    print_api_call("dojichart.setIntervalWidth(" + (current_val + 1) + ")");
  },
  "barwidthdecr": function(btn) {
    var current_val = candle_layer.getCandleBodyWidth();
    candle_layer.setCandleBodyWidth(current_val - 1);
    volume_layer.setBarWidth(current_val - 1);
    dojichart.draw();
    print_api_call("dojichart.setCandleBodyWidth(" + (current_val - 1) + ")");
  },
  "barwidthincr": function(btn) {
    var current_val = candle_layer.getCandleBodyWidth();
    candle_layer.setCandleBodyWidth(current_val + 1);
    volume_layer.setBarWidth(current_val + 1);
    dojichart.draw();
    print_api_call("dojichart.setCandleBodyWidth(" + (current_val + 1) + ")");
  },
  "scrollstart": function(btn) {
    dojichart.scroll(0, false);
    print_api_call("dojichart.scroll(0, false)");
  },
  "scrollend": function(btn) {
    dojichart.scroll(0, true);
    print_api_call("dojichart.scroll(0, true)");
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
