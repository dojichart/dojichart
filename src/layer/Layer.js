"use strict";

var _ = require("underscore");
var Type = require("../core/Type");

const _default_config = {
};

/**
 * Represents a layer.
 * <br><br>
 * @extends core.Type
 * @memberof layer
 */
class Layer extends Type {

  /**
   * Instantiate Layer
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
    this.elements = [];
  }

  /**
   * Sets parent component
   * @param {core.Component} comp
   */
  setParentComponent(comp) {
    this._parent_component = comp;
  }

  /**
   * Get parent component
   * @returns {core.Component} parent component
   */
  getParentComponent() {
    return this._parent_component;
  }

  /**
   * Get canvas context
   * @returns {CanvasRenderingContext2D} canvas context
   */
  _getContext() {
    return this.getParentComponent().getContext();
  }

  /**
   * Get layer width
   * @returns {number} layer width expressed in pixels
   */
  getWidth() {
    return this.getParentComponent().getWidth();
  }

  /**
   * Get layer drawing width, equal to width minus padding
   * @returns {number} drawing width expressed in pixels
   */
  getDrawingWidth() {
    return this.getParentComponent().getDrawingWidth();
  }

  /**
   * Get layer height
   * @returns {number} layer height expressed in pixels
   */
  getHeight() {
    return this.getParentComponent().getHeight();
  }

  /**
   * Get minimum field
   * <br><br>
   * Returns the name of the field with the lowest value for a given data point.
   * @returns {string|undefined} field name
   */
  getMinField() {
    return this.minField;
  }

  /**
   * Get maximum field
   * <br><br>
   * Returns the name of the field with the highest value for a given data point.
   * @returns {string|undefined} field name
   */
  getMaxField() {
    return this.maxField;
  }

  /**
   * Get minimum value
   * <br><br>
   * Returns the value corresponding to the bottom edge of the layer
   * @returns {string|undefined} field name
   */
  getMinValue() {
    return this.minValue;
  }

  /**
   * Get maximum value
   * <br><br>
   * Returns the value corresponding to the top edge of the layer
   * @returns {string|undefined} field name
   */
  getMaxValue() {
    return this.maxValue;
  }

}

module.exports = Layer;
