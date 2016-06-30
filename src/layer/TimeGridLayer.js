"use strict";

var _ = require("underscore");
var Layer = require("../layer/Layer");
var VerticalLine = require("../element/VerticalLine");

const _default_config = {
  lineColor: "#BBBBBB",
  showLabels: true,
  labelColor: "#555555",
  labelFont: "7pt normal normal arial;"
};

/**
 * Represents time grid layer, consisting of vertical lines.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */
class TimeGridLayer extends Layer {

  /**
   * Instantiate TimeGridLayer
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
  }

  /**
   * Get start of vertical line in unit pixels
   * @returns {number} in pixels
   */
  getLineStart() {
    return 0;
  }

  /**
   * Get end of vertical line in unit pixels
   * @returns {number} in pixels
   */
  getLineEnd() {
    return this.getHeight();
  }

  /**
   * Render layer onto canvas
   * @param {object} data
   * @param {number} count
   * @param {number} offset
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} valueBounds
   */
  draw(data, count, offset, valueToPixel, indexToPixel, valueBounds) {

    var context = this._getContext();
    var data_arr = data.getRawData();
    this.elements = [];

    for(var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++)
    {
      if(this.timeGrid.lineAt(i) !== undefined)
      {
        var line = new VerticalLine(
          this,
          i, // index
          this.getLineStart(),
          this.getLineEnd());
        this.elements.push(line);
        line.draw(context, valueToPixel, indexToPixel, this);
      }

    }

  }

}

module.exports = TimeGridLayer;
