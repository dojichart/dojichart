"use strict";

var Element = require("../element/Element");

/**
 * Represents a vertical line.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */
class VerticalLine extends Element {

  /**
   * Instantiate VerticalLine
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {number} start
   * @param {number} end
   */
  constructor(layer, index, start, end) {
    super({});
    this.layer = layer;
    this.index = index;
    this.start = start;
    this.end = end;
  }

  /**
   * Draw vertical line on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */
  draw(context, valueToPixel, indexToPixel, config) {

    var x = indexToPixel(this.index);

    context.beginPath();
    context.moveTo(x, this.start);
    context.lineTo(x, this.end);
    context.strokeStyle = config.lineColor;
    context.stroke();

  }

  /**
   * Get index
   * @returns {number}
   */
  getIndex() {
    return this.index;
  }

  /**
   * Get start
   * @returns {number} Start of line in unit pixels from top edge.
   */
  getStart() {
    return this.start;
  }

  /**
   * Get end
   * @returns {number} End of line in unit pixels in from top edge.
   */
  getEnd() {
    return this.end;
  }
}

module.exports = VerticalLine;
