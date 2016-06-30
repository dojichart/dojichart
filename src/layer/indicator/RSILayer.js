"use strict";

var _ = require("underscore");
var Layer = require("../../layer/Layer");
var Arc = require("../../element/Arc");

const _default_config = {
  input: "close",
  output: "_rsi",
  period: 14,
  color: "red",
  minValue: 0.0,
  maxValue: 100.0
};

/**
 * Represents a RSI chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */
class RSILayer extends Layer {

  /**
   * Instantiate RSILayer
   * @constructor
   * @param {Object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
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
    var input_field = field_map[this.input]; // i.e. close
    var output_field = this.output;
    var period = this.period;
    var queue = [], gain_queue = [], loss_queue = [];
    var prev_close, prev_avg_gain, prev_avg_loss;
    var loss_sum = 0.0, gain_sum = 0.0;

    for(var i = 1; i < data_arr.length; i++)
    {
      var dat = data_arr[i];
      var dat_prev = data_arr[i - 1];

      var change = dat[input_field] - dat_prev[input_field];
      var abs_change = Math.abs(change);
      var current_gain = 0.0;
      var current_loss = 0.0;
      var avg_gain = 0.0;
      var avg_loss = 0.0;
      var rs;

      if(change >= 0.0)
      {
        current_gain = abs_change;
      }
      else
      {
        current_loss = abs_change;
      }

      if(queue.length < period)
      {
       queue.push(change);
        if(change >= 0.0)
        {
          gain_queue.push(abs_change);
          gain_sum += abs_change;
        }
        else
        {
          loss_queue.push(abs_change);
          loss_sum += abs_change;
        }
      }
      else if(queue.length === period)
      {
        rs = gain_sum / loss_sum;
        dat[output_field] = 100.0 - (100.0 / (1.0 + rs));
        if(isNaN(dat[output_field]))
        {
          dat[output_field] = 0.0;
        }
        queue.push(change); // length=(data.periods + 1)
      }
      else
      {
        avg_gain = (prev_avg_gain * (period - 1) + current_gain) / period;
        avg_loss = (prev_avg_loss * (period - 1) + current_loss) / period;

        rs = avg_gain / avg_loss;
        dat[output_field] = 100.0 - (100.0 / (1.0 + rs));

        if(isNaN(dat[output_field]))
        {
          dat[output_field] = 0.0;
        }
      }

      prev_avg_gain = avg_gain;
      prev_avg_loss = avg_loss;
      prev_close = dat[output_field];
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

module.exports = RSILayer;
