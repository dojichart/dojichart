"use strict";

var _ = require("underscore");
var TimePanel = require("../panel/TimePanel");
var TimeLabelsLayer = require("../layer/TimeLabelsLayer");

const _default_config = {
  height: 16,
  crosshair: {
    value: false,
    time: {
      label: true
    }
  }
};

/**
 * Represents a panel, for displaying for the display of time labels.
 * <br><br>
 * @extends panel.TimePanel
 * @memberof panel
 */
class TimeLabelsPanel extends TimePanel {

  /**
   * Instantiate TimeLabelsPanel
   * @constructor
   * @param {Object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
  }

  /**
   * Initialize layers
   * <br><br>
   * This must be invoked.
   */
  initLayers() {

    this.primaryLayer = this.primaryLayer || new TimeLabelsLayer({
      timeGrid: this.getParentChart().getTimeGrid()
    });
    this.primaryLayer.setParentComponent(this);

  }

  /**
   * Get class name of underlying HTMLElement
   * @returns {string}
   */
  getClassName() {
    return super.getClassName() + " timelabelspanel";
  }

}

module.exports = TimeLabelsPanel;
