"use strict";

var _ = require("underscore");
var Stats = require("fast-stats").Stats;
var Layer = require("../../layer/Layer");
var Arc = require("../../element/Arc");

const _default_config = {
  input: "close",
  upperBandOutputPrefix: "_bb_upper",
  midOutputPrefix: "_bb_mid",
  lowerBandOutputPrefix: "_bb_lower",
  period: 20,
  multiplier: 2,
  bandColor: "rgba(0, 0, 0, 0.3)",
  midColor: "rgba(0, 0, 0, 0.3)"
};

/**
 * Represents a Bollinger Bands chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */
class BollingerBandsLayer extends Layer {

  /**
   * Instantiate BollingerBandsLayer
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
    this.upperBandOutput = this.upperBandOutputPrefix + "" + this.period + "x" + this.multiplier;
    this.midOutput = this.midOutputPrefix + "" + this.period + "x" + this.multiplier;
    this.lowerBandOutput = this.lowerBandOutputPrefix + "" + this.period + "x" + this.multiplier;
    this.minField = this.lowerBandOutput;
    this.maxField = this.upperBandOutput;
  }

  /**
   * Precompute indicator fields using time series OHLCV data.
   * <br><br>
   * This is invoked before draw().
   * @param {timeseries.TimeSeriesData} data
   */
  precompute(data) {
    var data_arr = data.getRawData();
    var field_map = data.getFieldMap();
    var input_field = field_map[this.input];
    var upper_band_field = this.upperBandOutput;
    var mid_field = this.midOutput;
    var lower_band_field = this.lowerBandOutput;
    var period = this.period;

    var mean = new Stats();
    var sd = new Stats();

    for(var i = 0; i < data_arr.length; i++)
    {
      var dat = data_arr[i];

      mean.push(dat[input_field]);
      sd.push(dat[input_field]);

      if(sd.length === period)
      {
        var ma = mean.amean();
        var std_dev = sd.stddev();
        dat[upper_band_field] = ma + 2 * std_dev;
        dat[mid_field] = ma;
        dat[lower_band_field] = ma - 2 * std_dev;
        if(isNaN(dat[upper_band_field]))
        {
          dat[upper_band_field] = 0.0;
        }
        if(isNaN(dat[lower_band_field]))
        {
          dat[lower_band_field] = 0.0;
        }
        sd.shift();
        mean.shift();
      }
    }

  }

  /**
   * Render layer onto canvas
   * @param {timeseries.TimeSeriesData} data
   * @param {number} count
   * @param {number} offset
   * @param {valueToPixel} valueToPixel
   * @param {indexToPixel} indexToPixel
   */
  draw(data, count, offset, valueToPixel, indexToPixel) {

    var context = this._getContext();
    var field_map = data.getFieldMap();
    var data_arr = data.getRawData();
    this.elements = [], this.elements_upper = [], this.elements_lower = [];
    var prev_arc_upper = null, prev_arc_mid = null, prev_arc_lower = null;

    for(var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++)
    {
      var dat = data_arr[i];

      // upper
      var arc_upper = new Arc(
        this,
        i,
        dat[field_map.time],
        dat[this.upperBandOutput],
        prev_arc_upper);
      this.elements_upper.push(arc_upper);
      arc_upper.draw(context, valueToPixel, indexToPixel, {color:this.bandColor});

      // mid (simple moving average)
      var arc_mid = new Arc(
        this,
        i,
        dat[field_map.time],
        dat[this.midOutput],
        prev_arc_mid);
      this.elements.push(arc_mid);
      arc_mid.draw(context, valueToPixel, indexToPixel, {color:this.midColor});

      // lower
      var arc_lower = new Arc(
        this,
        i,
        dat[field_map.time],
        dat[this.lowerBandOutput],
        prev_arc_lower);
      this.elements_lower.push(arc_lower);
      arc_lower.draw(context, valueToPixel, indexToPixel, {color:this.bandColor});

      prev_arc_upper = arc_upper;
      prev_arc_mid = arc_mid;
      prev_arc_lower = arc_lower;
    }

  }

}

module.exports = BollingerBandsLayer;
