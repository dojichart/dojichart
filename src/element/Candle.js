"use strict";

var Element = require("../element/Element");

/**
 * Represents a candle element.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */
class Candle extends Element {

  /**
   * Instantiate Candle
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {string} time
   * @param {number} open
   * @param {number} high
   * @param {number} low
   * @param {number} close
   */
  constructor(layer, index, time, open, high, low, close) {
    super({});
    this.layer = layer;
    this.index = index;
    this.time = time;
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
  }

  /**
   * Draw candle on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */
  draw(context, valueToPixel, indexToPixel, config) {

    var body_low, body_high, body_color;

    if(this.close >= this.open)
    {
      body_low = this.open;
      body_high = this.close;
      body_color = config.bullBodyColor;
    }
    else
    {
      body_low = this.close;
      body_high = this.open;
      body_color = config.bearBodyColor;
    }

    // Both wicks
    var wick_x = indexToPixel(this.index);
    var wick_w = config.candleWickWidth;

    // Wick upper
    var wick_y = valueToPixel(this.high);
    var wick_h = valueToPixel(body_high) - wick_y;

    context.beginPath();
    context.rect(wick_x, wick_y, wick_w, wick_h);
    context.fillStyle = config.wickColor;
    context.fill();

    // Wick lower
    wick_y = valueToPixel(body_low);
    wick_h = valueToPixel(this.low) - wick_y;

    context.beginPath();
    context.rect(wick_x, wick_y, wick_w, wick_h);
    context.fillStyle = config.wickColor;
    context.fill();

    // Body
    var body_x = wick_x - Math.ceil((config.candleBodyWidth - 1) * 0.5);
    var body_y = valueToPixel(body_high);
    var body_w = config.candleBodyWidth;
    var body_h = valueToPixel(body_low) - body_y;

    context.beginPath();
    context.rect(body_x, body_y, body_w, body_h);
    context.fillStyle = body_color;
    context.fill();

  }

  /**
   * Get index
   * @returns {number} index
   */
  getIndex() {
    return this.index;
  }

  /**
   * Get time
   * @returns {string} timestamp string
   */
  getTime() {
    return this.time;
  }

  /**
   * Get open price value
   * @returns {number} open price value
   */
  getOpen() {
    return this.open;
  }

  /**
   * Get high price value
   * @returns {number} high price value
   */
  getHigh() {
    return this.high;
  }

  /**
   * Get low price value
   * @returns {number} low price value
   */
  getLow() {
    return this.low;
  }

  /**
   * Get close price value
   * @returns {number} low price value
   */
  getClose() {
    return this.close;
  }

}

module.exports = Candle;
