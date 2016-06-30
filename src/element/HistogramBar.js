"use strict";

var Element = require("../element/Element");

/**
 * Represents an histogram bar element.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */
class HistogramBar extends Element {

  /**
   * Instantiate HistogramBar
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {string} time
   * @param {number} value
   */
  constructor(layer, index, time, value) {
    super({});
    this.layer = layer;
    this.index = index;
    this.time = time;
    this.value = value;
  }

  /**
   * Draw histogram bar on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */
  draw(context, valueToPixel, indexToPixel, config) {

    var x = indexToPixel(this.index) - Math.ceil((config.barWidth - 1) * 0.5);
    var y = valueToPixel(this.value);
    var w = config.barWidth;
    var h = valueToPixel(0) - y;

    context.beginPath();
    context.rect(x, y, w, h);
    context.fillStyle = config.barColor;
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
   * Get value at arc's right vertex
   * @returns {number} value
   */
  getValue() {
    return this.value;
  }

}

module.exports = HistogramBar;
