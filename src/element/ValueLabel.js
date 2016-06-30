"use strict";

var Element = require("../element/Element");

/**
 * Represents a label associated with the value axis (y).
 * <br><br>
 * @extends element.Element
 * @memberof element
 */
class ValueLabel extends Element {

  /**
   * Instantiate ValueLabel
   * @constructor
   * @param {Layer} layer
   * @param {number} value
   * @param {number} x
   */
  constructor(layer, value, x) {
    super({});
    this.layer = layer;
    this.value = value;
    this.x = x;
  }

  /**
   * Draw value label on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} config
   */
  draw(context, valueToPixel, indexToPixel, config) {

    var x = this.x + config.labelPaddingLeft;
    var y = valueToPixel(this.value);

    var label_text = "" + this.value + "";

    context.font = config.labelFont;
    context.textBaseline = "middle";
    context.fillStyle = config.labelColor;
    context.fillText(label_text, x, y);

  }

  /**
   * Get value
   * @returns {number}
   */
  getValue() {
    return this.value;
  }

}

module.exports = ValueLabel;
