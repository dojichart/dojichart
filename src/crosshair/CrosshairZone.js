"use strict";

var Type = require("../core/Type");
var adjustCanvas = require('../core/adjustCanvas');


/**
 * Represents a crosshair (pair of crosshairs) overlaid on a chart component.
 * <br><br>
 * @extends core.Type
 * @memberof crosshair
 */
class CrosshairZone extends Type {

  /**
   * Instantiate CrosshairZone
   * @constructor
   * @param {crosshair:Crosshair} parent_crosshair
   * @param {core.Component} component
   */
  constructor(parent_crosshair, component) {
    super({});
    this._parent_crosshair = parent_crosshair;
    this._underlying_component = component;
    this.name = "crosshair-" + this._underlying_component.getClassName().replace(/ /g, "");
  }

  /**
   * Render crosshair over component.
   * @param {number} zone_index
   * @returns {external:HTMLCanvasElement}
   */
  render(zone_index) {
    var comp = this._underlying_component;
    var comp_el = comp.getEl();
    var region_el = comp_el.parentNode;
    var canvas = window.document.createElement("CANVAS");
    canvas.className = "crosshair " + this.name;
    canvas.setAttribute("ch-zone-index", ""+zone_index+"");
    canvas.setAttribute("width", comp.getWidth());
    canvas.setAttribute("height", comp.getHeight());
    adjustCanvas(canvas);
    this._el = canvas;
    region_el.appendChild(canvas);
    return canvas;
  }

  /**
   * Get underlying HTMLCanvasElement the crosshair is drawn onto.
   * @returns {external:HTMLCanvasElement}
   */
  getEl() {
    return this._el;
  }

  /**
   * Get underlying componnet
   * @returns {core:Component}
   */
  getComponent() {
    return this._underlying_component;
  }

}

module.exports = CrosshairZone;
