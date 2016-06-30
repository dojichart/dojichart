"use strict";

var _ = require("underscore");
var Layer = require("../../layer/Layer");

const _default_config = {
  highInput: "high",
  lowInput: "low",
  volumeInput: "volume",
  relativeWidth: 0.3333,
  vertexCount: 120,
  color: "rgba(153, 180, 255, 0.7)"
};

/**
 * Represents a volume profile chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */
class VolumeProfileLayer extends Layer {

  /**
   * Instantiate VolumeProfileLayer
   * @constructor
   * @param {Object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
  }

  /**
   * Render layer onto canvas
   * @param {timeseries.TimeSeriesData} data
   * @param {number} count
   * @param {number} offset
   * @param {valueToPixel} valueToPixel
   * @param {indexToPixel} indexToPixel
   * @param {timeseries.ValueBounds} value_bounds
   */
  draw(data, count, offset, valueToPixel, indexToPixel, value_bounds) {

    var context = this._getContext();
    var field_map = data.getFieldMap();
    var data_arr = data.getRawData();
    this.elements = [];

    var vertex_count = this.vertexCount;
    var min = value_bounds.min;
    var max = value_bounds.max;
    var range = max - min;
    var pixel_width = this.profileWidth || (this.getDrawingWidth() * this.relativeWidth);
    var pixel_height = this.getHeight();
    var bar_width = pixel_height / vertex_count;
    var half_bar_width = bar_width * 0.5;
    var hist = [];
    var high_field = field_map[this.highInput];
    var low_field = field_map[this.lowInput];
    var volume_field = field_map[this.volumeInput];

    var max_value = 0;

    for(var i = 0; i < vertex_count; i++)
    {
      hist[i] = 0;
    }

    for(i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++)
    {
      var dat = data_arr[i];
      var high = dat[high_field], low = dat[low_field], vol = dat[volume_field];

      var hist_index_low = Math.floor((low - min) / range * vertex_count); // e.g. (4475 - 4450) / 2000 * 20 = floor(0.25) = 0
      var hist_index_high = Math.floor((high - min) / range * vertex_count);

      var vol_fract = 1 / ((hist_index_high - hist_index_low) + 1);

      for(var h = hist_index_low; h <= hist_index_high; h++)
      {
        hist[h] += Math.round(vol * vol_fract);
      }
    }

    for(var j = 0; j < vertex_count; j++)
    {
      if(hist[j] > max_value)
      {
        max_value = hist[j];
      }
    }

    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(0, pixel_height);

    for(j = 0; j < vertex_count; j++)
    {
      var val = hist[j];

      var x = val / max_value * pixel_width;
      var y = pixel_height - (j + 1) / vertex_count * pixel_height * 1.0; // index + 1 because we flip y

      context.lineTo(x, y + half_bar_width);
      context.lineTo(x, y - half_bar_width);
    }

    context.lineTo(0, 0);
    context.closePath();
    context.fill();

  }

}

module.exports = VolumeProfileLayer;
