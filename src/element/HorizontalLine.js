"use strict";

var Element = require("../element/Element");

/**
 * Represents a horizontal line.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */
class HorizontalLine extends Element {

  /**
   * Instantiate HorizontalLine
   * @constructor
   * @param {Layer} layer
   * @param {number} value
   * @param {number} start
   * @param {number} end
   */
  constructor(layer, value, start, end) {
    super({});
    this.layer = layer;
    this.value = value;
    this.start = start;
    this.end = end;
  }

  /**
   * Draw horizontal line on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */
  draw(context, valueToPixel, indexToPixel, config) {

    var y = valueToPixel(this.value);

    context.beginPath();
    context.moveTo(this.start, y);
    context.lineTo(this.end, y);
    context.strokeStyle = config.lineColor;
    context.stroke();

  }

  /**
   * Get value
   * @returns {number}
   */
  getValue() {
    return this.value;
  }

  /**
   * Get start
   * @returns {number} Start of line in unit pixels from left edge.
   */
  getStart() {
    return this.start;
  }

  /**
   * Get end
   * @returns {number} End of line in unit pixels from left edge.
   */
  getEnd() {
    return this.end;
  }

}

module.exports = HorizontalLine;
