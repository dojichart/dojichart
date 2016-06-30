"use strict";

var Type = require("../core/Type");
var Region = require("../core/Region");

/**
 * Chart component base class.
 * <br><br>
 * @extends core.Type
 * @memberof core
 */
class Component extends Type {

  /**
   * Instantiate Component
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    super(config);
    this.layers = [];
  }

  /**
   * Destroy underlying HTMLElement
   */
  destroy() {
    var el = this.getEl();
    if(el && el.parentNode)
    {
      el.parentNode.removeChild(el);
    }
    this.el = undefined;
  }

  /**
   * Sets parent chart
   * @param {core.Chart} chart
   */
  setParentChart(parent_chart) {
    this._parent_chart = parent_chart;
  }

  /**
   * Get parent chart
   * @returns {core.Chart} chart
   */
  getParentChart() {
    return this._parent_chart;
  }

  /**
   * Get underlying HTMLElement
   * @returns {external:HTMLElement}
   */
  getEl() {
    return this.el;
  }

  /**
   * Get class name of underlying HTMLElement
   * @returns {string}
   */
  getClassName() {
    return "component";
  }

  /**
   * Get component height
   * @returns {number} Height in pixels
   */
  getHeight() {
    return this.height;
  }

  /**
   * Render
   * @param {string} region_name Name of HTMLElement, specified using data-name attribute. 
   * @returns {this}
   */
  render(region_name) {
    var region = Region.getRegionsByName(this.getParentChart().getEl())[region_name];
    this.el = this.createElement();
    region.getEl().innerHTML = "";
    region.getEl().appendChild(this.el);
    return this;
  }

  /**
   * Create HTMLElement
   * <br><br>
   * Can be overridden, for example if CANVAS is used.
   * @returns {external.HTMLElement}
   */
  createElement() {
    var div = window.document.createElement("DIV");
    div.className = this.getClassName();
    div.style.height = this.height + "px";
    return div;
  }

  /**
   * Add layer
   * @param {layer.Layer} layer
   */
  addLayer(layer) {
    layer.setParentComponent(this);
    this.layers.push(layer);
  }

  /**
   * Add layer
   * @returns {layer.Layer[]}
   */
  getAllLayers() {
    return this.layers;
  }

  /**
   * Remove layers
   * @param {layer.Layer[]} exclude_layers Layers to not removed
   */
  removeLayers(exclude_layers) {
    exclude_layers = exclude_layers || [];
    this.layers = exclude_layers;
    this._layersHaveChanged();
  }

  /**
   * To be invoked immediately after layers have changed.
   * <br><br>
   * Intended to be implemented by subclasses.
   */
  _layersHaveChanged() {
  }

}

module.exports = Component;
