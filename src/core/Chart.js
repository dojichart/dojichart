"use strict";

var _ = require("underscore");
var Type = require("../core/Type");
var TimeSeriesData = require("../timeseries/TimeSeriesData");
var TimeGrid = require("../core/TimeGrid");
var Crosshair = require("../crosshair/Crosshair");

const _default_config = {
  width: "auto",
  intervalWidth: 7,
  paddingRight: 40,
  offset: 0,
  relativeOffset: 0,
  offsetFromEnd: false,
  scrollToEndOnLoad: true,
  scrollToEndOnResize: true,
  verticalGridLineSpacing: 50
};

/**
 * Represents a DojiChart instance.
 * <br><br>
 * Typically a Chart will consist of Panels, which in turn consist of layers.
 * @extends core.Type
 * @memberof core
 */
class Chart extends Type {

  /**
   * Instantiate Chart
   * @constructor
   * @param {external:HTMLElement} el
   * @param {object} config
   */
  constructor(el, config) {
    config = _.extend({}, _default_config, config);
    super(config);
    this._el = el;
    this._components = [];
    this._data = undefined;
    if(_.isNumber(this.width))
    {
      this._el.style.width = this.width + "px";
    }
    this._initCrosshair();
    this._listenForDOMEvents();
    this._time_grid = new TimeGrid();
  }

  /**
   * Initialize crosshair
   * @private
   */
  _initCrosshair() {
    if(this.crosshair)
    {
      this.crosshair = _.isObject(this.crosshair) ? this.crosshair : {};
      this._crosshair = new Crosshair(this, this.crosshair);
    }
  }

  /**
   * Refresh crosshair
   * @private
   */
  _refreshCrosshair() {
    if(this._crosshair === undefined)
    {
      this._initCrosshair();
    }
    else
    {
      this._crosshair.refresh();
    }
  }

  /**
   * Listen for DOM events, specifically window resize
   * @private
   */
  _listenForDOMEvents() {

    window.addEventListener("resize", this._handleWindowResize.bind(this));

  }

  /**
   * Handle window resize event
   * @private
   */
  _handleWindowResize(ev) {
    if(this.width === "auto")
    {
      this._refreshCrosshair();
      if(this.scrollToEndOnResize === true)
      {
        this._setOffset(0, true);
      }
      this._refreshCrosshair();
      this.draw();
    }
  }

  /**
   * Get underlying HTMLElement
   * @returns {external.HTMLElement}
   */
  getEl() {
    return this._el;
  }

  /**
   * Get width
   * @returns {(number|string)} Width in pixels or "auto"
   */
  getWidth() {
    if(this.width === "auto")
    {
      return this.getEl().clientWidth;
    }
    else
    {
      return this.width;
    }
  }

  /**
   * Get right padding 
   * @returns {number} in pixels
   */
  getPaddingRight() {
    return this.paddingRight;
  }

  /**
   * Get drawing width
   * @returns {number} This is the total width minus right padding (in pixels).
   */
  getDrawingWidth() {
    return this.getWidth() - this.getPaddingRight();
  }

  /**
   * Get height
   * @returns {number} Height of underlying HTMLElement in pixels.
   */
  getHeight() {
    return this._el.offsetHeight;
  }

  /**
   * Set interval width
   * @param {number} Size of interval in pixels.
   */
  setIntervalWidth(interval_width) {
    this.intervalWidth = interval_width;
  }

  /**
   * Get interval width 
   * @returns {number} Size of interval in pixels.
   */
  getIntervalWidth() {
    return this.intervalWidth;
  }

  /**
   * Get offset
   * @returns {number}
   */
  getOffset() {
    return this.offset;
  }

  /**
   * Get time grid instance that is used by Chart.
   * @returns {core.TimeGrid}
   */
  getTimeGrid() {
    return this._time_grid;
  }

  /**
   * Get all chart components.
   * @returns {core.Component[]}
   */
  getComponents() {
    return this._components;
  }

  /**
   * Add component to chart.
   * @param {string} region_name
   * @param {core.Component} comp
   */
  addComponent(region_name, comp) {
    //Component.addComponent(region_name, comp);
    comp.setParentChart(this);
    if(comp.initLayers)
    {
      comp.initLayers(); // invoked after setParentChart because methods of Chart required
    }
    this._components.push(comp);
    comp.render(region_name);
    this._componentsHaveChanged();
  }

  /**
   * Remove components from chart.
   * @param {core.Component[]} exclude_components. Components to not remove.
   */
  removeComponents(exclude_components) {
    exclude_components = exclude_components || [];
    for(var i = 0; i < this._components.length; i++)
    {
      var comp = this._components[i];
      var exclude = false;
      for(var j = 0; j < exclude_components.length; j++)
      {
        if(comp === exclude_components[j])
        {
          exclude = true;
          break;
        }
      }
      if(exclude !== true)
      {
        comp.destroy();
      }
    }
    this._components = exclude_components;
    this._componentsHaveChanged();
  }

  /**
   * Load data.
   * @param {timeseries.DataPoint[]} raw_data
   * @param {string} symbol
   * @param {string} granularity
   * @param {boolean} do_draw
   */
  loadData(raw_data, symbol, granularity, do_draw) {
    this._data = new TimeSeriesData(raw_data, this.fieldMap, symbol, granularity);
    for(var i = 0; i < this._components.length; i++)
    {
      var comp = this._components[i];
      if(comp.precompute)
      {
        comp.precompute(this._data);
      }
    }
    if(do_draw === undefined || do_draw === true)
    {
      if(this.scrollToEndOnLoad === true)
      {
        this.scroll(0, true, false);
      }
      this.draw();
    }
  }

  /**
   * Draw all components.
   */
  draw() {
    if(this._data !== undefined)
    {
      var interval_capacity = this._calculateIntervalCapacity(); 
      var indexToPixel = this.getIndexToPixelMapper();

      this._time_grid.refresh(this._data, interval_capacity, this.getOffset(), this.getDrawingWidth(), this.verticalGridLineSpacing);

      for(var i = 0; i < this._components.length; i++)
      {
        var comp = this._components[i];
        if(comp.draw)
        {
          comp.draw(this._data, interval_capacity, this.getOffset(), indexToPixel);
        }
      }

      this.emit("afterdraw");
    }
  }

  /**
   * Calculate number of elements that will fit on the chart.
   * @private
   */
  _calculateIntervalCapacity() {
    return Math.floor(this.getDrawingWidth() / this.intervalWidth);
  }

  /**
  * indexToPixel
  * @callback indexToPixel
  * @param {number} index
  * @returns {number} x-value expressed in unit pixels
  */

  /**
   * Get index to pixel mapper function
   * @returns {indexToPixel} function
   */
  getIndexToPixelMapper() {
    var px_interval_width = this.getIntervalWidth();
    var offset = this.getOffset();
    var mapFunc = function(index) {
      return (index - offset) * px_interval_width;
    };
    return mapFunc;
  }

  /**
   * Invoked after components have changed.
   * @private
   */
  _componentsHaveChanged() {
    this._refreshCrosshair();
  }

  /**
   * Scroll by specified offset.
   * @param {number} given_offset
   * @param {boolean} from_end
   * @param {boolean} do_draw
   */
  scroll(given_offset, from_end, do_draw) {
    this._setOffset(given_offset, from_end);
    if(do_draw === undefined || do_draw === true)
    {
      this.draw();
    }
  }

  /**
   * Set offset
   * @param {number} given_offset
   * @param {boolean} from_end
   * @private
   */
  _setOffset(given_offset, from_end) {
    this.relativeOffset = given_offset;
    this.offsetFromEnd = from_end;
    if(from_end === true && this._data !== undefined)
    {
      var data_length = this._data.getRawData().length;
      var interval_capacity = this._calculateIntervalCapacity();
      this.offset = (data_length - interval_capacity) - given_offset;
    }
    else
    {
      this.offset = given_offset;
    }
  }

  /**
   * Get offset relative to either start or end of data.
   * @returns {number}
   */
  getRelativeScrollOffset() {
    return this.relativeOffset;
  }

  /**
   * Is scroll offset from end?
   * @returns {boolean}
   */
  isScrollOffsetFromEnd() {
    return this.offsetFromEnd;
  }

  /**
   * Is data scrolled before start?
   * @returns {boolean}
   */
  isBeyondStart() {
    return this.offset < 0;
  }

}

module.exports = Chart;
