
"use strict";

var Chart = require("./src/core/Chart");
var TimePanel = require("./src/panel/TimePanel");
var TimeValuePanel = require("./src/panel/TimeValuePanel");
var TimeLabelsPanel = require("./src/panel/TimeLabelsPanel");
var CandleLayer = require("./src/layer/CandleLayer");
var OHLCLayer = require("./src/layer/OHLCLayer");
var ValueGridLayer = require("./src/layer/ValueGridLayer");
var TimeGridLayer = require("./src/layer/TimeGridLayer");
var VolumeLayer = require("./src/layer/indicator/VolumeLayer");
var SimpleMovingAverageLayer = require("./src/layer/indicator/SimpleMovingAverageLayer");
var ExponentialMovingAverageLayer = require("./src/layer/indicator/ExponentialMovingAverageLayer");
var VolumeProfileLayer = require("./src/layer/indicator/VolumeProfileLayer");
var RSILayer = require("./src/layer/indicator/RSILayer");
var BollingerBandsLayer = require("./src/layer/indicator/BollingerBandsLayer");
var StochasticLayer = require("./src/layer/indicator/StochasticLayer");

var exports = {
  /** @namespace core */
  core: {
    Chart: Chart
  },
  /** @namespace panel */
  panel: {
    TimePanel: TimePanel,
    TimeValuePanel: TimeValuePanel,
    TimeLabelsPanel: TimeLabelsPanel
  },
  /** @namespace layer */
  layer: {
    CandleLayer: CandleLayer,
    OHLCLayer: OHLCLayer,
    ValueGridLayer: ValueGridLayer,
    TimeGridLayer: TimeGridLayer,
    /** @namespace layer.indicator */
    indicator: {
      VolumeLayer: VolumeLayer,
      SimpleMovingAverageLayer: SimpleMovingAverageLayer,
      ExponentialMovingAverageLayer: ExponentialMovingAverageLayer,
      VolumeProfileLayer: VolumeProfileLayer,
      RSILayer: RSILayer,
      StochasticLayer: StochasticLayer,
      BollingerBandsLayer: BollingerBandsLayer
    }
  }
};

module.exports = exports;

window.DojiChart = exports;
