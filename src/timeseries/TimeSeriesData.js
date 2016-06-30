"use strict";

var _ = require("underscore");
var Type = require("../core/Type");

const _default_config = {
};

/**
 * Represents a time series data point, where properties will be for price and volume.
 * @typedef {Object} DataPoint
 * @memberof timeseries
 */

/**
 * Used to map OHLCV data point properties.
 * @typedef {Object} FieldMap
 * @property {string} time Name of time field.
 * @property {string} open Name of open field.
 * @property {string} high Name of high field.
 * @property {string} low Name of low field.
 * @property {string} close Name of close field.
 * @property {string} volume Name of volume field.
 * @memberof timeseries
 */

/**
 * @typedef {Object} ValueBounds
 * @property {number} min
 * @property {number} max
 * @memberof timeseries
 */

/**
 * @typedef {Object} MinAndMaxFields
 * @property {(string|undefined)} min
 * @property {(string|undefined)} max
 * @memberof timeseries
 */

/**
 * @typedef {Object} MinAndMaxValues
 * @property {number|undefined} min
 * @property {number|undefined} max
 * @memberof timeseries
 */

/**
 * The time series data that is represented graphically in the chart panels.
 * <br><br>
 * @extends core.Type
 * @memberof timeseries
 */
class TimeSeriesData extends Type {

  /**
   * Instantiate TimeSeriesData
   * @constructor
   * @param {timeseries.DataPoint[]} raw_data
   * @param {timeseries.FieldMap} field_map
   * @param {string} symbol
   * @param {string} gran
   * @param {Object} config
   */
  constructor(raw_data, field_map, symbol, gran, config) {
    config = _.extend({}, _default_config, config);
    super(config);
    this._raw_data = raw_data;
    this._field_map = field_map;
    this._symbol = symbol;
    this._granularity = gran;
    this._initTimeToIndexMap();
  }

  /**
   * Initialize time-to-index map.
   * @private
   */
  _initTimeToIndexMap() {
    this._time_to_index_map = {};
    for(var i = 0; i < this._raw_data.length; i++)
    {
      var dat = this._raw_data[i];
      var time = dat[this._field_map.time];
      this._time_to_index_map[time] = i;
    }
  }

  /**
   * Get data array, that was originally provided in the constructor.
   * @returns {timeseries.DataPoint[]}
   */
  getRawData() {
    return this._raw_data;
  }

  /**
   * Get field map, that was originally provided in the constructor.
   * @returns {timeseries.FieldMap}
   */
  getFieldMap() {
    return this._field_map;
  }

  /**
   * Get symbol
   * @returns {string}
   */
  getSymbol() {
    return this._symbol;
  }

  /**
   * Get granularity
   * @returns {string}
   */
  getGranularity() {
    return this._granularity;
  }

  /**
   * Deduce minimum and maximum values of in range data.
   * <br><br>
   * Minimum and maximum values can be explicity given, otherwise field names.
   * Where no minimum is provided, zero will be assumed.
   * @param {number} count
   * @param {number} offset
   * @param {timeseries.MinAndMaxFields} min_and_max_fields
   * @param {timeseries.MinAndMaxValues} min_and_max_values
   * @returns {timeseries.ValueBounds}
   */
  findValueBounds(count, offset, min_and_max_fields, min_and_max_values) {

    var data_arr = this._raw_data;
    var index_start = offset;
    var index_end = (count + offset) - 1;

    if(index_start < 0)
    {
      index_start = 0;
    }
    if(index_end >= data_arr.length)
    {
      index_end = data_arr.length - 1;
    }

    var min_field = min_and_max_fields.min;
    var max_field = min_and_max_fields.max;
    var min_value = min_and_max_values.min;
    var max_value = min_and_max_values.max;
    var minimum = 99999999, maximum = -99999999;
    var i, dat;

    // Deduce minimum value
    if(min_value !== undefined)
    {
      minimum = min_value;
    }
    else if(min_field !== undefined)
    {
      var min_field_name = this._field_map[min_field];
      for(i = index_start; i <= index_end; i++)
      {
        dat = data_arr[i];
        var min = dat[min_field_name]; // e.g. low
        if(min < minimum)
        {
          minimum = min;
        }
      }
    }
    else
    {
      minimum = 0;
    }

    // Deduce maximum value
    if(max_value !== undefined)
    {
      maximum = max_value;
    }
    else if(max_field !== undefined)
    {
      var max_field_name = this._field_map[max_field];
      for(i = index_start; i <= index_end; i++)
      {
        dat = data_arr[i];
        var max = dat[max_field_name]; // e.g. low
        if(max > maximum)
        {
          maximum = max;
        }
      }
    }

    return {
      min: minimum,
      max: maximum
    };
  }

}

module.exports = TimeSeriesData;
