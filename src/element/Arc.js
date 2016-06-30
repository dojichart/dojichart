"use strict";

var Element = require("../element/Element");

/**
 * Represents an arc element.
 * <br><br>
 * @extends element.Element
 * @memberof element
 */
class Arc extends Element {

  /**
   * Instantiate Arc
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {string} time
   * @param {number} value
   * @param {Arc} prev_arc
   */
  constructor(layer, index, time, value, prev_arc) {
    super({});
    this.layer = layer;
    this.index = index;
    this.time = time;
    this.value = value;
    this.previous_arc = prev_arc;
  }

  /**
   * Draw arc on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */
  draw(context, valueToPixel, indexToPixel, config) {

    if(this.previous_arc)
    {
      var x0 = indexToPixel(this.previous_arc.getIndex());
      var y0 = valueToPixel(this.previous_arc.getValue());
      var x = indexToPixel(this.index);
      var y = valueToPixel(this.value);

      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x, y);
      context.strokeStyle = config.color;
      context.stroke();
    }

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

module.exports = Arc;
