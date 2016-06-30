"use strict";

var _ = require("underscore");
var Layer = require("../../layer/Layer");
var HistogramBar = require("../../element/HistogramBar");

const _default_config = {
  barColor: "blue",
  barWidth: 3,
  minValue: 0,
  maxField: "volume"
};

/**
 * Represents a volume histogram chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer.indicator
 */
class VolumeLayer extends Layer {

  /**
   * Instantiate VolumeLayer
   * @constructor
   * @param {Object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
  }

  /**
   * Set width of each volume bar
   * @param {number} Width in pixels.
   */
  setBarWidth(bar_width) {
    this.barWidth = bar_width;
  }

  /**
   * Get volume bar width
   * @returns {number} Width in pixels.
   */
  getBarWidth() {
    return this.barWidth;
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

    for(var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++)
    {
      var dat = data_arr[i];
      var bar = new HistogramBar(
        this,
        i,
        dat[field_map.time],
        dat[field_map.volume]);
      bar.draw(context, valueToPixel, indexToPixel, this);
      this.elements.push(bar);
    }

  }

}

module.exports = VolumeLayer;
