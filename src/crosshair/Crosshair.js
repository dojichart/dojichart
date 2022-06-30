"use strict";

var _ = require("underscore");
var Type = require("../core/Type");
var CrosshairZone = require("../crosshair/CrosshairZone");

const _default_config = {
  lineColor: "#000000",
  labelHeight: 16,
  showTimeLabel: false,
  labelFont: "7pt normal normal arial;",
  labelBgColor: "#000000",
  labelColor: "#FFFFFF",
  timeLabelWidth: 70,
};

/**
 * Represents a crosshair (pair of crosshairs) overlaid on chart.
 * <br><br>
 * @extends core.Type
 * @memberof crosshair
 */
class Crosshair extends Type {

  /**
   * Instantiate Crosshair
   * @constructor
   * @param {core:Chart} parent_chart
   * @param {Object} config
   */
  constructor(parent_chart, config) {
    config = _.extend({}, _default_config, config);
    super(config);
    this._crosshair_zones = {};
    this._parent_chart = parent_chart;
    this.width = this.getParentChart().getWidth(); 
    this.lineWidth = this.getParentChart().getDrawingWidth(); 
    this.valueLabelWidth = this.width - this.lineWidth;
    this._render();
    this._listenForDOMEvents();
  }

  /**
   * Destroy underlying HTMLElements
   */
  destroy() {
    for(var i in this._crosshair_zones)
    {
      if(this._crosshair_zones.hasOwnProperty(i))
      {
        var canvas = this._crosshair_zones[i].getEl();
        if(canvas && canvas.parentNode)
        {
          canvas.parentNode.removeChild(canvas);
        }
      }
    }
  }

  /**
   * Get parent chart
   * @returns {core.Chart} chart
   */
  getParentChart() {
    return this._parent_chart;
  }

  /**
   * Destroy and re-render.
   * @private
   */
  _render() {

    this.destroy();
    var comps = this.getParentChart().getComponents();

    for(var i = 0; i < comps.length; i++)
    {
      var ch_zone = new CrosshairZone(this, comps[i]);
      this._crosshair_zones[""+i+""] = ch_zone;
      ch_zone.render(i);
    }

  }

  /**
   * Listen for mousemove and mouseout events.
   * @private
   */
  _listenForDOMEvents() {

    this.getParentChart().getEl().addEventListener("mousemove", this._handleMousemove.bind(this));
    this.getParentChart().getEl().addEventListener("mouseout", this._handleMouseout.bind(this));

  }

  /**
   * Handle mousemove event
   * @param {external:Event} ev
   * @private
   */
  _handleMousemove(ev) {
    var zone_index = ev.target.getAttribute("ch-zone-index"); 
    var ch_zone = this._crosshair_zones[zone_index];
    this._draw(ev.offsetX, ev.offsetY, ch_zone, this._crosshair_zones);
  }

  /**
   * Handle mouseout event
   * @param {external:Event} ev
   * @private
   */
  _handleMouseout(ev) {
    this.clear();
  }

  /**
   * Refresh dimensions, for example after browser window is resized.
   */
  refresh() {

    this.width = this.getParentChart().getWidth(); 
    this.lineWidth = this.getParentChart().getDrawingWidth(); 
    this.valueLabelWidth = this.width - this.lineWidth;

    this._render();

  }

  /**
   * Handle mouseout event
   * @param {number} x
   * @param {number} y
   * @param {crosshair.CrosshairZone} ch_zone
   * @param {Object} ch_zones {crosshair.CrosshairZone} map
   * @private
   */
  _draw(x, y, ch_zone, ch_zones) {
    if(ch_zone)
    {
      for(var i in ch_zones)
      {
        if(ch_zones.hasOwnProperty(i))
        {
          var comp = ch_zones[i].getComponent();
          var canvas = ch_zones[i].getEl();
          var context = canvas.getContext("2d");
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Vertical crosshair
          context.beginPath();
          context.rect(x, 0, 1, canvas.height);
          context.fillStyle = this.lineColor;
          context.fill();

          if(comp.crosshair && comp.crosshair.time && comp.crosshair.time.label)
          {
            // label
            context.beginPath();
            context.rect(x, 0, this.timeLabelWidth, this.labelHeight);
            context.fillStyle = this.labelBgColor;
            context.fill();

            var time_grid = this.getParentChart().getTimeGrid();
            var time_text = time_grid.pixelToTimeString(x);

            context.font = this.labelFont;
            context.textAlign = "left";
            context.textBaseline = "middle";
            context.fillStyle = this.labelColor;
            context.fillText(time_text, x + 4, this.labelHeight * 0.5);
          }

          // Horizontal crosshair
          if(ch_zones[i] === ch_zone && (comp.crosshair === undefined || comp.crosshair.value))
          {
            // line
            context.beginPath();
            context.rect(0, y, this.lineWidth, 1);
            context.fillStyle = this.lineColor;
            context.fill();

            // label
            context.beginPath();
            context.rect(this.lineWidth, y - (this.labelHeight * 0.5), this.valueLabelWidth, this.labelHeight);
            context.fillStyle = this.labelBgColor;
            context.fill();

            var value_text = "" + comp.pixelToValue(y).toFixed(4);

            context.font = this.labelFont;
            context.textAlign = "left";
            context.textBaseline = "middle";
            context.fillStyle = this.labelColor;
            context.fillText(value_text, this.lineWidth + 4, y);
          }
        }
      }
    }

  }

  /**
   * Clear all crosshair canvases.
   */
  clear() {
    for(var i in this._crosshair_zones)
    {
      if(this._crosshair_zones.hasOwnProperty(i))
      {
        var canvas = this._crosshair_zones[i].getEl();
        if(canvas)
        {
          canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  }

}

module.exports = Crosshair;
