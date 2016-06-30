"use strict";

var _ = require("underscore");
var TimePanel = require("../panel/TimePanel");
var TimeGridLayer = require("../layer/TimeGridLayer");
var ValueGridLayer = require("../layer/ValueGridLayer");

const _default_config = {
  paddingTop: 10,
  paddingBottom: 10,
  primaryAtBack: false
};

/**
 * Represents a panel with time and value axis.
 * <br><br>
 * @extends panel.TimePanel
 * @memberof panel
 */
class TimeValuePanel extends TimePanel {

  /**
   * Instantiate TimeValuePanel
   * @constructor
   * @param {Object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
    this._pixelToValue = function(){return 0.0;};
    this.drawingHeight = Math.round(this.getHeight() - (this.paddingTop + this.paddingBottom));
  }

  /**
   * Initialize layers
   * <br><br>
   * This must be invoked.
   */
  initLayers() {

    if(this.grid)
    {
      var value_lines;
      if(typeof this.grid === "object" && this.grid.value)
      {
        value_lines = this.grid.value.lines;
      }

      // value grid
      this.value_grid_layer = this.value_grid_layer || new ValueGridLayer({
        labelWidth: this.getParentChart().getPaddingRight(),
        lines: value_lines
      });
      this.value_grid_layer.setParentComponent(this);

      // time grid
      this.time_grid_layer = this.time_grid_layer || new TimeGridLayer({
        timeGrid: this.getParentChart().getTimeGrid()
      });
      this.time_grid_layer.setParentComponent(this);
    }

    this.primaryLayer.setParentComponent(this);

  }

  /**
   * Get class name of underlying HTMLElement
   * @returns {string}
   */
  getClassName() {
    return super.getClassName() + " timevaluepanel";
  }

  /**
   * Get drawing height
   * @returns {number}
   */
  getDrawingHeight() {
    return this.drawingHeight;
  }

  /**
   * Draw all layers.
   * @param {timeseries.TimeSeriesData} data
   * @param {number} count
   * @param {number} offset
   * @param {indexToPixel} indexToPixel
   */
  draw(data, count, offset, indexToPixel) {
    var value_bounds = data.findValueBounds(count, offset, this.getMinAndMaxFields(), this.getMinAndMaxValues());
    var valueToPixel = this.getValueToPixelMapper(value_bounds, true);
    this._pixelToValue = this.getPixelToValueMapper(value_bounds, true);
    var layers = this.getAllLayers();
    this._refresh();

    // Draw grid
    if(this.grid)
    {
      if(this.value_grid_layer)
      {
        this.value_grid_layer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
      }
      if(this.time_grid_layer)
      {
        this.time_grid_layer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
      }
    }

    if(this.primaryAtBack === true)
    {
      // Draw primary layer
      this.primaryLayer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
    }

    // Draw overlays
    for(var i = 0; i < layers.length; i++)
    {
      var layer = layers[i];
      if(layer.draw)
      {
        layer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
      }
    }

    if(this.primaryAtBack === undefined || this.primaryAtBack !== true)
    {
      // Draw primary layer
      this.primaryLayer.draw(data, count, offset, valueToPixel, indexToPixel, value_bounds);
    }

  }

  /**
   * Get minimum and maximum fields for this panel.
   * @returns {timeseries.MinAndMaxFields}
   */
  getMinAndMaxFields() {
    return {
      min: this.primaryLayer.getMinField(),
      max: this.primaryLayer.getMaxField()
    };
  }

  /**
   * Get minimum and maximum values for this panel.
   * @returns {timeseries.MinAndMaxValues}
   */
  getMinAndMaxValues() {
    return {
      min: this.primaryLayer.getMinValue(),
      max: this.primaryLayer.getMaxValue()
    };
  }

  /**
  * valueToPixel
  * @callback valueToPixel
  * @param {number} value
  * @returns {number} y-value expressed in unit pixels
  */

  /**
   * Get value to pixel mapper function
   * @param {timeseries.ValueBounds} value_bounds
   * @param {boolean} flip
   * @returns {valueToPixel} function
   */
  getValueToPixelMapper(value_bounds, flip) {
    var val_min = value_bounds.min;
    var val_max = value_bounds.max;
    var val_range = val_max - val_min;
    var px_height = this.getDrawingHeight();
    var px_padding_offset = this.paddingTop;
    var mapFunc;
    if(flip === true)
    {
      mapFunc = function(val) {
        return (px_height - (val - val_min) / val_range * px_height) + px_padding_offset;
      };
    }
    else
    {
      mapFunc = function(val) {
        return ((val - val_min) / val_range * px_height) - px_padding_offset;
      };
    }
    return mapFunc;
  }

  /**
  * pixelToValue
  * @callback pixelToValue
  * @param {number} y-value expressed in unit pixels
  * @returns {number} value corresponding to time series data
  */

  /**
   * Get pixel to vallue mapper function
   * @param {timeseries.ValueBounds} value_bounds
   * @param {boolean} flip
   * @returns {pixelToValue}
   */
  getPixelToValueMapper(value_bounds, flip) {
    var val_min = value_bounds.min;
    var val_max = value_bounds.max;
    var val_range = val_max - val_min;
    var px_height = this.getDrawingHeight();
    var px_padding_offset = this.paddingTop;
    var mapFunc;
    if(flip === true)
    {
      mapFunc = function(px) {
        return (px_height - (px - px_padding_offset)) / px_height * val_range + val_min;
      };
    }
    else
    {
      mapFunc = function(px) {
        return (px + px_padding_offset) / px_height * val_range + val_min;
      };
    }
    return mapFunc;
  }

  pixelToValue(px) {
    return this._pixelToValue(px);
  }

}

module.exports = TimeValuePanel;

