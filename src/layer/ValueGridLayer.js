"use strict";

var _ = require("underscore");
var Layer = require("../layer/Layer");
var HorizontalLine = require("../element/HorizontalLine");
var ValueLabel = require("../element/ValueLabel");

const _default_config = {
  lineSpacing: 50,
  lineColor: "#BBBBBB",
  showLabels: true,
  labelColor: "#555555",
  labelFont: "7pt normal normal arial;",
  labelPaddingLeft: 4 
};

/**
 * Represents value grid layer, consisting of horizontal lines.
 * <br><br>
 * @extends layer.Layer
 * @memberof layer
 */
class ValueGridLayer extends Layer {

  /**
   * Instantiate ValueGridLayer
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config || {});
  }

  /**
   * Get width of labels (on right-hand side of chart)
   * @returns {number} in pixels
   */
  getLabelWidth() {
    return this.labelWidth;
  }

  /**
   * Get start of horizontal line in unit pixels
   * @returns {number} in pixels
   */
  getLineStart() {
    return 0;
  }

  /**
   * Get end of horizontal line in unit pixels
   * @returns {number} in pixels
   */
  getLineEnd() {
    return this.getWidth() - this.getLabelWidth();
  }

  /**
   * Render layer onto canvas
   * @param {object} data
   * @param {number} count
   * @param {number} offset
   * @param {valueToPixel} function
   * @param {indexToPixel} function
   * @param {object} valueBounds
   */
  draw(data, count, offset, valueToPixel, indexToPixel, valueBounds) {

    var context = this._getContext();
    this.elements = [];
    this.label_elements = [];
    var min = valueBounds.min, max = valueBounds.max; 
    var derived_lines;
    var dec_places;

    if(this.lines === undefined)
    {
      derived_lines = [];

      var denom = this.granularity;

      if(denom === undefined)
      {
        denom = ValueGridLayer.determineValueGranularity(min, max, this.getHeight(), this.lineSpacing);
      }

      // e.g. var p = (Math.round(price_min * 400.0) / 400.0); // where denom = 0.0025
      var value = (Math.round(min * 1.0 / denom) / (1.0 / denom));
      dec_places = ValueGridLayer.decimalPlaces(denom);

      var i = 0;
      while(value <= max)
      {
        value = ValueGridLayer.decimalAdjust("round", value, -7);
        derived_lines.push(value);

        value += denom;
        i++;
      }
    }
    else
    {
      derived_lines = this.lines;
    }

    for(var l = 0; l < derived_lines.length; l++)
    {
      var val = derived_lines[l];

      var line = new HorizontalLine(
        this,
        val,
        this.getLineStart(),
        this.getLineEnd());
      this.elements.push(line);
      line.draw(context, valueToPixel, indexToPixel, this);

      if(this.showLabels === true)
      {
        var label = new ValueLabel(
          l,
          val.toFixed(dec_places || 2),
          this.getLineEnd());
        this.label_elements.push(label);
        label.draw(context, valueToPixel, indexToPixel, this);
      }
    }

  }

  /**
   * @static
   * Determine grid line interval
   * @param {number} min
   * @param {number} max
   * @param {number} pixel_height
   * @param {number} pixel_spacing
   * @returns {number} number representing interval between horizontal grid lines
   */
  static determineValueGranularity(min, max, pixel_height, pixel_spacing) {

    var range = max - min; // e.g. 1815-1762 or 1.4172-1.4069
    var divisions = pixel_height / pixel_spacing; // e.g. 300/20
    var seg = range / divisions;

    var gran = 0.00001;
    var prev_gran = 0.000005;
    var gran_factors = [2.5, 2, 2]; // 1*2.5=2.5, 2.5*2=5, 5*2=10, 10*2.5=25, ...
    //var grans = [10000,5000,2500,1000,500,250,100,50,25,10,5,2.5,1,0.5,0.25,0.1,0.05,0.025,0.01,0.005,0.0025,0.0001,0.00005,0.000025,0.00001];
    var nextGran = function(current_value, i) {
      return current_value * gran_factors[i % 3];
    };

    for(var i = 0; ; i++)
    {
      if(gran >= seg)
      {
        return prev_gran;
      }

      prev_gran = gran;
      gran = nextGran(gran, i);
    }

    return 1000;

  }

  /**
   * @static
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
   *
   * Decimal adjustment of a number.
   * @param {string} type The type of adjustment.
   * @param {number} value The number.
   * @param {number} exp The exponent (the 10 logarithm of the adjustment base).
   * @returns {number} The adjusted value.
  */
  static decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === "undefined" || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split("e");
    value = Math[type](+(value[0] + "e" + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split("e");
    return +(value[0] + "e" + (value[1] ? (+value[1] + exp) : exp));
  }

  // http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
  static decimalPlaces(num) {
    var match = (""+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
      0,
      // Number of digits right of decimal point. // Adjust for scientific notation.
      (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
    );
  }

}

module.exports = ValueGridLayer;
