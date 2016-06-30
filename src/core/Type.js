"use strict";

var _ = require("underscore");
var EventEmitter = require("events").EventEmitter;

/**
 * External class
 *
 * @external Event
 * @see {@link https://developer.mozilla.org/en/docs/Web/API/Event}
 */

/**
 * External class
 *
 * @external Date
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date}
 */

/**
 * External class
 *
 * @external HTMLElement
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement}
 */

/**
 * External class
 *
 * @external HTMLCanvasElement
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement}
 */

/**
 * External class
 *
 * @external CanvasRenderingContext2D
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D}
 */

/**
 * Base class
 * @memberof core
 */
class Type extends EventEmitter {

  /**
   * Instantiate Type
   * @constructor
   * @param {Object} config
   */
  constructor(config) {
    super();
    this._config = config;
    _.extend(this, config);
  }

  /**
   * Get config object
   * @returns {Object} config
   */
  getConfig() {
    return this._config;
  }

}

module.exports = Type;
