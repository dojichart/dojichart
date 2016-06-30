"use strict";

var _ = require("underscore");
var Layer = require("../layer/Layer");
var TimeLabel = require("../element/TimeLabel");

const _default_config = {
  labelColor: "#444444",
  labelFont: "7pt normal normal arial;",
  labelY: 8
};

/**
 * Represents time labels layer.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */
class TimeLabelsLayer extends Layer {

  /**
   * Instantiate TimeLabelsLayer
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
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
    var field_map = data.getFieldMap();
    var data_arr = data.getRawData();
    this.elements = [];
    var line_spacing = this.timeGrid.getLineSpacing();
    var label;
    var labels = [];

    for(var i = offset >= 0 ? offset : 0; i < offset + count && i < data_arr.length; i++)
    {
      var dat = data_arr[i];
      var time_str = dat[field_map.time];

      var grid_line = this.timeGrid.lineAt(i);
      if(grid_line !== undefined)
      {
        label = new TimeLabel(
          this,
          i, // index
          time_str,
          grid_line.format);

        labels.push(label);
      }
    }

    // look ahead
    for(i = 0; i < labels.length - 1; i++)
    {
      label = labels[i];
      var next_label = labels[i + 1];
      var x = indexToPixel(label.getIndex());
      var next_x = indexToPixel(next_label.getIndex());
      if(next_x - x >= 0.6 * line_spacing)
      {
        label.draw(context, indexToPixel, this);
        this.elements.push(label);
      }
    }

  }

}

module.exports = TimeLabelsLayer;
