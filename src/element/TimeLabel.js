"use strict";

var Moment = require("moment");
var Element = require("../element/Element");

/**
 * Represents a label associated with the time axis (x).
 * <br><br>
 * @extends element.Element
 * @memberof element
 */
class TimeLabel extends Element {

  /**
   * Instantiate TimeLabel
   * @constructor
   * @param {Layer} layer
   * @param {number} index
   * @param {string} time
   * @param {string} format
   */
  constructor(layer, index, time, format) {
    super({});
    this.layer = layer;
    this.index = index;
    this.time = time;
    this.format = format;
  }

  /**
   * Draw time label on given context
   * @param {external:CanvasRenderingContext2D} context
   * @param {indexToPixel} function
   * @param {object} config
   */
  draw(context, indexToPixel, config) {

    var x = indexToPixel(this.index);

    context.font = config.labelFont;
    context.textAlign = "left";
    context.textBaseline = "middle";
    context.fillStyle = config.labelColor;
    context.fillText(TimeLabel.formatTimestamp(this.time, this.format), x, config.labelY);

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
   * @static
   * Format a timestamp string using supplied Moment.js format
   * @param {string} time_str timestamp string
   * @param {string} format
   * @returns {string} timestamp string
   */
  static formatTimestamp(time_str, format) {

    var moment = Moment(time_str);

    return moment.format(format);

  }

}

module.exports = TimeLabel;
