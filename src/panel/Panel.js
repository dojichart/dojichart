"use strict";

var Component = require("../core/Component");

/**
 * Represents a chart panel.
 * <br><br>
 * @extends core.Component
 * @memberof panel
 */
class Panel extends Component {

  /**
   * Instantiate Panel
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    super(config);
  }

  /**
   * Get class name of underlying HTMLElement
   * @returns {string}
   */
  getClassName() {
    return super.getClassName() + " panel";
  }

  /**
   * Get panel width
   * @returns {number} Width in pixels
   */
  getWidth() {
    return this.getParentChart().getWidth();
  }

  /**
   * Get panel drawing width
   * @returns {number} Drawing width in pixels
   */
  getDrawingWidth() {
    return this.getParentChart().getDrawingWidth();
  }

}

module.exports = Panel;
