"use strict";

var _ = require("underscore");
var Layer = require("../../layer/Layer");
var Arc = require("../../element/Arc");

const _default_config = {
  input: "close",
  outputPrefix: "_sma",
  period: 50,
  color: "orange"
};

/**
 * Represents a SMA chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */
class SimpleMovingAverageLayer extends Layer {

  /**
   * Instantiate SimpleMovingAverageLayer
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
    this.output = this.outputPrefix + "" + this.period; // e.g. _sma50, _sma200, etc
    this.minField = this.output;
    this.maxField = this.output;
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
    var output_field = this.output;
    var input_field = field_map[this.input];
    var period = this.period;
    var queue = [], sum = 0.0;
    for(var i = 0; i < data_arr.length; i++)
    {
      var dat = data_arr[i];
      queue.push(dat[input_field]);
      sum += dat[input_field];
      if(queue.length === period + 1)
      {
        sum -= queue.shift();
        dat[output_field] = sum / period;
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
    this.elements = [];
    var prev_arc = null;

    for(var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++)
    {
      var dat = data_arr[i];

      var arc = new Arc(
        this,
        i,
        dat[field_map.time],
        dat[this.output],
        prev_arc);
      this.elements.push(arc);
      arc.draw(context, valueToPixel, indexToPixel, this);

      prev_arc = arc;
    }

  }

}

module.exports = SimpleMovingAverageLayer;
