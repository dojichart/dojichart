"use strict";

var _ = require("underscore");
var Layer = require("../layer/Layer");
var OHLCBar = require("../element/OHLCBar");

const _default_config = {
  bearBodyColor: "red",
  bullBodyColor: "green",
  wickColor: "black",
  candleBodyWidth: 3,
  candleWickWidth: 1,
  minField: "low",
  maxField: "high"
};

/**
 * Represents an OHLC bar chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */
class OHLCLayer extends Layer {

  /**
   * Instantiate OHLCLayer
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config || {});
  }

  /**
   * Set OHLC body width
   * @param {number} size width in pixels
   */
  setCandleBodyWidth(size) {
    this.candleBodyWidth = size;
  }

  /**
   * Get width of OHLC bar body
   * @returns {number} width in pixels
   */
  getCandleBodyWidth() {
    return this.candleBodyWidth;
  }

  /**
   * Set bar color for OHLC bars where close price is lower than open price.
   * @param {number} color
   */
  setBearBodyColor(color) {
    this.bearBodyColor = color;
  }

  /**
   * Get bar color for OHLC bars where close price is lower than open price.
   * @returns {number} width in pixels
   */
  getBearBodyColor() {
    return this.bearBodyColor;
  }

  /**
   * Set bar color for OHLC bars where close price is higher than open price.
   * @param {number} color
   */
  setBullBodyColor(color) {
    this.bullBodyColor = color;
  }

  /**
   * Get bar color for OHLC bars where close price is higher than open price.
   * @returns {number} width in pixels
   */
  getBullBodyColor() {
    return this.bullBodyColor;
  }

  /**
   * Render layer onto canvas
   * @param {object} data
   * @param {number} count
   * @param {number} offset
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   */
  draw(data, count, offset, valueToPixel, indexToPixel) {

    var context = this._getContext();
    var field_map = data.getFieldMap();
    var data_arr = data.getRawData();
    this.elements = [];

    for(var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++)
    {
      var dat = data_arr[i];
      var bar = new OHLCBar(
        this,
        i,
        dat[field_map.time],
        dat[field_map.open],
        dat[field_map.high],
        dat[field_map.low],
        dat[field_map.close]);
      bar.draw(context, valueToPixel, indexToPixel, this);
      this.elements.push(bar);
    }

  }

}

module.exports = OHLCLayer;
