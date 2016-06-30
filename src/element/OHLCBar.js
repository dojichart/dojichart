"use strict";

var Element = require("../element/Element");

/**
 * Represents a OHLC bar element.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */
class OHLCBar extends Element {

  /**
   * Instantiate OHLCBar
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
   * Draw OHLC bar on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */
  draw(context, valueToPixel, indexToPixel, config) {

    var body_color;

    if(this.close >= this.open)
    {
      body_color = config.bullBodyColor;
    }
    else
    {
      body_color = config.bearBodyColor;
    }

    // Vertical bar
    var vert_x = indexToPixel(this.index);
    var vert_w = Math.floor(config.candleBodyWidth * 0.5) || 1;
    var vert_y = valueToPixel(this.high);
    var vert_h = valueToPixel(this.low) - valueToPixel(this.high);

    context.beginPath();
    context.rect(vert_x, vert_y, vert_w, vert_h);
    context.fillStyle = body_color;
    context.fill();

    // Open horizontal
    var open_x = (vert_x - config.candleBodyWidth) + 1;
    var open_y = valueToPixel(this.open);
    var open_w = config.candleBodyWidth;
    var open_h = 1;

    context.beginPath();
    context.rect(open_x, open_y, open_w, open_h);
    context.fillStyle = body_color;
    context.fill();

    // Close horizontal
    var close_x = vert_x;
    var close_y = valueToPixel(this.close);
    var close_w = config.candleBodyWidth;
    var close_h = 1;

    context.beginPath();
    context.rect(close_x, close_y, close_w, close_h);
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

module.exports = OHLCBar;
