"use strict";

var _ = require("underscore");
var Layer = require("../../layer/Layer");
var Arc = require("../../element/Arc");

const _default_config = {
  lowInput: "low",
  highInput: "high",
  closeInput: "close",
  kOutput: "_stoch14_k",
  dOutput: "_stoch14_d",
  period: 14,
  kMa: 3,
  dMa: 5,
  kColor: "orange",
  dColor: "lime",
  minValue: 0.0,
  maxValue: 100.0
};

/**
 * Represents a Stochastic chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */
class StochasticLayer extends Layer {

  /**
   * Instantiate StochasticLayer
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
    var k_field = this.kOutput;
    var d_field = this.dOutput;
    var low_input = field_map[this.lowInput];
    var high_input = field_map[this.highInput];
    var close_input = field_map[this.closeInput];
    var period = this.period, k_ma = this.kMa, d_ma = this.dMa;
    var low_queue = [], high_queue = [], k_queue = [], k_sum = 0.0, d_queue = [], d_sum = 0.0;
    var low, high;
    for(var i = 0; i < data_arr.length; i++)
    {
      var dat = data_arr[i];
      // Low
      low_queue.push(dat[low_input]); // e.g. low
      if(low_queue.length === period) // e.g. 14
      {
        low = Math.min.apply(Math, low_queue);
        low_queue.shift(); // remove first
      }
      // High
      high_queue.push(dat[high_input]); // e.g. high
      if(high_queue.length === period) // e.g. 14
      {
        high = Math.max.apply(Math, high_queue);
        high_queue.shift(); // remove first
      }
      // k and d
      if(low !== undefined && high !== undefined)
      {
        var k = (dat[close_input] - low) / (high - low) * 100.0;

        if(isNaN(k))
        {
          k = 0.0;
        }

        // Stochastic %K applied with SMA(3)
        k_queue.push(k);
        k_sum += k;

        if(k_queue.length === k_ma + 1)
        {
          k_sum -= k_queue.shift();
          dat[k_field] = k_sum / k_ma;
        }

        if(dat[k_field] !== undefined)
        {
          // MA3 of %K
          d_queue.push(dat[k_field]);
          d_sum += dat[k_field];

          if(d_queue.length === d_ma + 1)
          {
            d_sum -= d_queue.shift();
            dat[d_field] = d_sum / d_ma;
          }
        }
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
    this.d_elements = [];
    var prev_k_arc = null, prev_d_arc = null;

    for(var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++)
    {
      var dat = data_arr[i];

      // d
      var d_arc = new Arc(
        this,
        i,
        dat[field_map.time],
        dat[this.dOutput],
        prev_d_arc);
      this.d_elements.push(d_arc);
      d_arc.draw(context, valueToPixel, indexToPixel, {color:this.dColor});

      // k
      var k_arc = new Arc(
        this,
        i,
        dat[field_map.time],
        dat[this.kOutput],
        prev_k_arc);
      this.elements.push(k_arc);
      k_arc.draw(context, valueToPixel, indexToPixel, {color:this.kColor});

      prev_k_arc = k_arc;
      prev_d_arc = d_arc;
    }

  }

}

module.exports = StochasticLayer;
