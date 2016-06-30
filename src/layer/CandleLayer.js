"use strict";

var _ = require("underscore");
var Layer = require("../layer/Layer");
var Candle = require("../element/Candle");

const _default_config = {
  bearBodyColor: "red",
  bullBodyColor: "green",
  wickColor: "black",
  candleBodyWidth: 5,
  candleWickWidth: 1,
  minField: "low",
  maxField: "high"
};

/**
 * Represents a candlestick chart layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */
class CandleLayer extends Layer {

  /**
   * Instantiate CandleLayer
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config || {});
  }

  /**
   * Set candle body width
   * @param {number} width in pixels
   */
  setCandleBodyWidth(candle_body_size) {
    this.candleBodyWidth = candle_body_size;
  }

  /**
   * Get width of candle body
   * @returns {number} width in pixels
   */
  getCandleBodyWidth() {
    return this.candleBodyWidth;
  }

  /**
   * Set candle body color for candles where close price is lower than open price.
   * @param {string} a CSS compatible color value, e.g. "red", "#FF0000", "rgb(255, 0, 0)"
   */
  setBearBodyColor(color) {
    this.bearBodyColor = color;
  }

  /**
   * Get candle body color for candles where close price is lower than open price.
   * @returns {number} width in pixels
   */
  getBearBodyColor() {
    return this.bearBodyColor;
  }

  /**
   * Set candle body color for candles where close price is higher than open price.
   * @param {string} a CSS compatible color value, e.g. "red", "#FF0000", "rgb(255, 0, 0)"
   */
  setBullBodyColor(color) {
    this.bullBodyColor = color;
  }

  /**
   * Get candle body color for candles where close price is higher than open price.
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
      var candle = new Candle(
        this,
        i,
        dat[field_map.time],
        dat[field_map.open],
        dat[field_map.high],
        dat[field_map.low],
        dat[field_map.close]);
      candle.draw(context, valueToPixel, indexToPixel, this);
      this.elements.push(candle);
    }

  }

}

module.exports = CandleLayer;
