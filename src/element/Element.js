"use strict";

var Type = require("../core/Type");

/**
 * Represents a visual chart element.
 * <br><br>
 * @extends core.Type
 * @memberof element
 */
class Element extends Type {

  /**
   * Instantiate Element
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    super(config);
  }

}

module.exports = Element;
