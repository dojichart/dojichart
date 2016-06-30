var expect = require("chai").expect;

var test = {
  core: {
    Type: require("./core/test.Type"),
    Region: require("./core/test.Region"),
    Component: require("./core/test.Component"),
    Chart: require("./core/test.Chart"),
    TimeGrid: require("./core/test.TimeGrid")
  },
  element: {
    Element: require("./element/test.Element"),
    Arc: require("./element/test.Arc"),
    Candle: require("./element/test.Candle"),
    HistogramBar: require("./element/test.HistogramBar"),
    OHLCBar: require("./element/test.OHLCBar"),
    HorizontalLine: require("./element/test.HorizontalLine"),
    VerticalLine: require("./element/test.VerticalLine"),
    TimeLabel: require("./element/test.TimeLabel"),
    ValueLabel: require("./element/test.ValueLabel")
  },
  panel: {
    Panel: require("./panel/test.Panel"),
    TimePanel: require("./panel/test.TimePanel"),
    TimeLabelsPanel: require("./panel/test.TimeLabelsPanel"),
    TimeValuePanel: require("./panel/test.TimeValuePanel")
  },
  layer: {
    Layer: require("./layer/test.Layer"),
    CandleLayer: require("./layer/test.CandleLayer"),
    OHLCLayer: require("./layer/test.OHLCLayer"),
    TimeGridLayer: require("./layer/test.TimeGridLayer"),
    ValueGridLayer: require("./layer/test.ValueGridLayer"),
    TimeLabelsLayer: require("./layer/test.TimeLabelsLayer")
  },
  indicator: {
    BollingerBandsLayer: require("./layer/indicator/test.BollingerBandsLayer"),
    RSILayer: require("./layer/indicator/test.RSILayer"),
    ExponentialMovingAverageLayer: require("./layer/indicator/test.ExponentialMovingAverageLayer"),
    SimpleMovingAverageLayer: require("./layer/indicator/test.SimpleMovingAverageLayer"),
    StochasticLayer: require("./layer/indicator/test.StochasticLayer"),
    VolumeLayer: require("./layer/indicator/test.VolumeLayer"),
    VolumeProfileLayer: require("./layer/indicator/test.VolumeProfileLayer")
  },
  timeseries: {
    TimeSeriesData: require("./timeseries/test.TimeSeriesData")
  },
  crosshair: {
    Crosshair: require("./crosshair/test.Crosshair"),
    CrosshairZone: require("./crosshair/test.CrosshairZone")
  }
};

describe("window", function() {
  it("should exist", function() {
    expect(window).to.exist;
  });
});

describe("window.document", function() {
  it("should exist", function() {
    expect(window.document).to.exist;
  });
});

for(var grp in test)
{
  if(test.hasOwnProperty(grp))
  {
    var module_group = test[grp];

    for(var mod in module_group)
    {
      if(module_group.hasOwnProperty(mod))
      {
        var test_module = module_group[mod];

        console.log("Invoking test module: " + grp + "." + mod);

        test_module();
      }
    }
  }
}
