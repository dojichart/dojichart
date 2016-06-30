"use strict";

var Type = require("../core/Type");

/**
 * Represents an underlyting HTMLElement that can contain a component.
 * <br><br>
 * @extends core.Type
 * @memberof core
 */
class Region extends Type {

  /**
   * Instantiate Component
   * @constructor
   * @param {external.HTMLElement} el
   */
  constructor(el) {
    super({});
    this.el = el;
    this.name = this.el.getAttribute("data-name");
  }

  /**
   * Get underlying HTMLElement
   * @returns {external.HTMLElement}
   */
  getEl() {
    return this.el;
  }

  /**
   * Get region name
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * Get region height
   * @returns {number} Height in pixels
   */
  getHeight() {
    return this.el.offsetHeight;
  }

  /**
   * @static
   * Get regions that are descendents of a specified HTMLElement.
   * @param {external.HTMLElement} el HTMLElement to search under.
   * @returns {object} Map of Regions by name
   */
  static getRegionsByName(el) {
    var regions_by_name = {};
    var region_els = Region.getElementsByClassName(el, "region");
    for(var i = 0; i < region_els.length; i++)
    {
      var region_el = region_els[i];
      var region = new Region(region_el);
      regions_by_name[region.getName()] = region;
    }
    return regions_by_name;
  }

  /**
   * @static
   * Get elements that are descendents of a specified HTMLElement.
   * @param {external.HTMLElement} start_el
   * @param {string} class_name
   * @returns {HTMLElement[]}
   */
  static getElementsByClassName(start_el, class_name) {

    var matches = [];

    function traverse(node) {
      for(var i = 0; i < node.childNodes.length; i++)
      {
        var child_node = node.childNodes[i];

        if(child_node.childNodes.length > 0)
        {
          traverse(child_node);
        }
        
        if(child_node.getAttribute && child_node.getAttribute("class"))
        {
          if(child_node.getAttribute("class").split(" ").indexOf(class_name) >= 0)
          {
            matches.push(child_node);
          }
        }
      }
    }
    
    traverse(start_el);

    return matches;

  }

}

module.exports = Region;
