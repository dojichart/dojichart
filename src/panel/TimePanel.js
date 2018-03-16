"use strict";

var _ = require("underscore");
var Panel = require("../panel/Panel");
var TimeGridLayer = require("../layer/TimeGridLayer");
var adjustCanvas = require('../core/adjustCanvas')

const _default_config = {
};

/**
 * Represents a panel with time axis.
 * <br><br>
 * @extends panel.Panel
 * @memberof panel
 */
class TimePanel extends Panel {

  /**
   * Instantiate TimePanel
   * @constructor
   * @param {Object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
  }

  /**
   * Set primary layer
   * <br><br>
   * This must be invoked before initLayers.
   * @param {layer.Layer} layer
   */
  setPrimaryLayer(layer) {
    this.primaryLayer = layer;
    this.primaryLayer.setParentComponent(this);
  }

  /**
   * Initialize layers
   * <br><br>
   * This must be invoked.
   */
  initLayers() {

    if(this.grid)
    {
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
    return super.getClassName() + " timepanel";
  }

  /**
   * Create HTMLElement
   * <br><br>
   * Overrides method of super.
   * @returns {external.HTMLCanvasElement}
   */
  createElement() {
    var canvas = window.document.createElement("CANVAS");
    canvas.className = this.getClassName();
    canvas.setAttribute("width", this.getWidth());
    canvas.setAttribute("height", this.getHeight());
    return canvas;
  }

  /**
   * Refresh canvas width and height
   * @private
   */
  _refresh() {
    var canvas = this.getEl();
    canvas.setAttribute("width", this.getWidth());
    canvas.setAttribute("height", this.getHeight());
    adjustCanvas(canvas)
  }

  /**
   * Get canvas context
   * @returns {CanvasRenderingContext2D}
   */
  getContext() {
    return this.getEl().getContext("2d");
  }

  /**
   * Precompute all layers.
   * <br><br>
   * This is invoked before draw().
   * @param {timeseries.TimeSeriesData}
   */
  precompute(data) {

    if(this.primaryLayer.precompute)
    {
      this.primaryLayer.precompute(data);
    }

    var layers = this.getAllLayers();
    for(var i = 0; i < layers.length; i++)
    {
      var layer = layers[i];
      if(layer.precompute)
      {
        layer.precompute(data);
      }
    }
  }

  /**
   * Draw all layers.
   * @param {timeseries.TimeSeriesData} data
   * @param {number} count
   * @param {number} offset
   * @param {indexToPixel} indexToPixel
   */
  draw(data, count, offset, indexToPixel) {
    var layers = this.getAllLayers();
    this._refresh();

    // Draw grid
    if(this.grid)
    {
      // time grid
      this.time_grid_layer = this.time_grid_layer || new TimeGridLayer({
      });

      this.time_grid_layer.draw(data, count, offset, null, indexToPixel, null);
    }

    for(var i = 0; i < layers.length; i++)
    {
      var layer = layers[i];
      if(layer.draw)
      {
        layer.draw(data, count, offset, null, indexToPixel, null);
      }
    }

    // Draw primary layer
    this.primaryLayer.draw(data, count, offset, null, indexToPixel, null);

  }

}

module.exports = TimePanel;
