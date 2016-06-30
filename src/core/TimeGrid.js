"use strict";

var _ = require("underscore");
var Moment = require("moment");
var Type = require("../core/Type");

const GRANS = {
  "M1": {ident:"M1", hours:1/60, mins: 1},
  "M5": {ident:"M5", hours:1/12, mins: 5},
  "M10": {ident:"M10", hours:1/6, mins: 10},
  "M15": {ident:"M15", hours:0.25, mins: 15},
  "M30": {ident:"M30", hours:0.5, mins: 30},
  "H1": {ident:"H1", hours:1, mins: 60},
  "H4": {ident:"H4", hours:4, mins: 60 * 4},
  "H8": {ident:"H8", hours:8, mins: 60 * 8},
  "D": {ident:"D", hours:24, mins: 60 * 24, days:1}, // 1 day
  "W": {ident:"W", hours:120, mins: 60 * 24 * 5, days:5, weeks:1}, // 5 days
  "M": {ident:"M", hours:504, mins: 60 * 24 * 21, days:21, weeks:4, months:1}, // 21 days
  "Q": {ident:"Q", hours:1512, mins: 60 * 24 * 63, days: 63, weeks:13, months:3}, // 63 days
  "Y": {ident:"Y", hours:6000, mins: 60 * 24 * 250, days: 250, weeks:51, months:12, years:1} // 250 days
};

const _default_config = {
};

/**
 * Non visual time grid, used by TimeGridLayer.
 * <br><br>
 * @extends core.Type
 * @memberof core
 */
class TimeGrid extends Type {

  /**
   * Instantiate TimeGrid
   * @constructor
   * @param {object} config
   */
  constructor(config) {
    config = _.extend({}, _default_config, config);
    super(config);
    this.lines = {};
    this._pixelToTimeString = function(){return "";};
  }

  /**
   * Refresh calculated time grid using current data in view.
   * @param {timeseries.TimeSeriesData} data
   * @param {number} count
   * @param {number} offset
   * @param {number} width
   * @param {number} line_spacing
   */
  refresh(data, count, offset, width, line_spacing) {

    this.lines = {};
    this.line_spacing = line_spacing;

    var field_map = data.getFieldMap();
    var data_arr = data.getRawData();
    var data_gran = data.getGranularity();

    var grid_gran = this.granularity;

    if(grid_gran === undefined)
    {
      grid_gran = TimeGrid.determineTimeGranularity(data_gran, count, width, line_spacing);
    }

    for(var i = offset >= 0 ? (offset + 1) : (0 + 1); i < offset + count && i < data_arr.length; i++)
    {
      var dat = data_arr[i];
      var dat_prev = data_arr[i - 1];

      var time_str = dat[field_map.time];
      var prev_time_str = dat_prev[field_map.time];

      var grid_line = TimeGrid.isGridLine(grid_gran, time_str, prev_time_str);
      if(grid_line !== null)
      {
        this.lines[""+i+""] = grid_line;
      }
    }

    this._pixelToTimeString = this.getPixelToTimeStringMapper(width, count, offset, data_arr, data_gran);

  }

  /**
   * Get pixel to time string map function.
   * @param {number} pixel_width
   * @param {number} interval_count
   * @param {number} offset
   * @param {timeseries.DataPoint[]} data_arr
   * @param {string} data_gran
   */
  getPixelToTimeStringMapper(pixel_width, interval_count, offset, data_arr, data_gran) {
    var format = "ddd D HH:mm";
    if(data_gran === "D" || data_gran === "W")
    {
      format = "ddd D MMM";
    }
    var mapFunc = function(px) {
      var index = Math.round(px / pixel_width * interval_count);
      var dat = data_arr[offset + index];
      if(dat)
      {
        return Moment(dat.time).format(format);
      }
      else
      {
        return "";
      }
    };
    return mapFunc;
  }

  /**
   * Get line at given index
   * @param {number} i
   * @returns {object|undefined}
   */
  lineAt(i) {
    return this.lines[""+i+""];
  }

  /**
   * Get spacing between lines
   * @returns {number} Interval between vertical grid lines in unit pixels
   */
  getLineSpacing() {
    return this.line_spacing;
  }

  /**
   * Get spacing between lines
   * @param {number} px Number of pixels from left of chart.
   * @returns {number} Index
   */
  pixelToTimeString(px) {
    return this._pixelToTimeString(px);
  }

  /**
   * @static
   * Determine if a grid line exists at given granulrity and time. 
   * @param {string} grid_gran
   * @param {string} time_str
   * @param {string} prev_time_str
   * @returns {object|null}
   */
  static isGridLine(grid_gran, time_str, prev_time_str) {

    var gran = GRANS[grid_gran];
    var d = new Date(time_str);
    var d_prev = new Date(prev_time_str);
    
    // M5, M10, M15 or M30
    if(gran.mins < 60 && TimeGrid.isNMinuteChange(gran.mins, d))
    {
      return {format:TimeGrid.determineMinFormat(d, d_prev)};
    }
    // H8, H4, H1
    else if(gran.hours < 24 && TimeGrid.isNHourChange(gran.hours, d))
    {
      return {format:TimeGrid.determineHourFormat(d, d_prev)};
    }
    // D
    else if(gran.days !== undefined && gran.days < 5 && TimeGrid.isDayChange(d, d_prev))
    {
      return {format:TimeGrid.determineDayFormat(d, d_prev)};
    }
    // W
    else if(gran.weeks !== undefined && gran.weeks === 1 && TimeGrid.isWeekChange(d, d_prev))
    {
      return {format:TimeGrid.determineWeekFormat(d, d_prev)};
    }
    // M
    else if(gran.months !== undefined && gran.months === 1 && TimeGrid.isMonthChange(d, d_prev))
    {
      return {format:TimeGrid.determineMonthFormat(d, d_prev)};
    }
    // Q
    else if(gran.months !== undefined && gran.months < 12 && TimeGrid.isNMonthChange(gran.months, d, d_prev))
    {
      return {format:TimeGrid.determineQuarterFormat(d, d_prev)};
    }
    // Y
    else if(TimeGrid.isYearChange(d, d_prev))
    {
      return {format:TimeGrid.determineYearFormat(d, d_prev)};
    }
    else
    {
      return null;
    }

  }

  /**
   * Determine if N minute interval
   * @param {number} mins
   * @param {external:Date} d
   * @returns {boolean}
   * @static
   */
  static isNMinuteChange(mins, d) {
    return d.getUTCMinutes() % mins === 0;
  }

  /**
   * Determine if hour interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {boolean}
   * @static
   */
  static isHourChange(d, d_prev) {
    return d.getUTCHours() !== d_prev.getUTCHours();
  }

  /**
   * Determine if N hour interval
   * @param {number} hours
   * @param {external:Date} d
   * @returns {boolean}
   * @static
   */
  static isNHourChange(hours, d) {
    return d.getUTCHours() % hours === 0 && d.getUTCMinutes() === 0;
  }

  /**
   * Determine if hour interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {boolean}
   * @static
   */
  static isDayChange(d, d_prev) {
    return d.getUTCDate() !== d_prev.getUTCDate();
  }

  /**
   * Determine if week interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {boolean}
   * @static
   */
  static isWeekChange(d, d_prev) {
    return Moment(d).utc().weeks() !== Moment(d_prev).utc().weeks();
  }

  /**
   * Determine if month interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {boolean}
   * @static
   */
  static isMonthChange(d, d_prev) {
    return d.getUTCMonth() !== d_prev.getUTCMonth();
  }

  /**
   * Determine if N month interval
   * @param {number} months
   * @param {external:Date} d
   * @returns {boolean}
   * @static
   */
  static isNMonthChange(months, d, d_prev) {
    return d.getUTCMonth() % months === 0 && TimeGrid.isMonthChange(d, d_prev);
  }

  /**
   * Determine if year interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {boolean}
   * @static
   */
  static isYearChange(d, d_prev) {
    return d.getUTCFullYear() !== d_prev.getUTCFullYear();
  }

  /**
   * Determine time stamp label format for minute interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {string} Moment.js format
   * @static
   */
  static determineMinFormat(d, d_prev) {
    if(TimeGrid.isDayChange(d, d_prev))
    {
      return "ddd D";
    }
    else if(TimeGrid.isHourChange(d, d_prev))
    {
      return "HH:mm";
    }
    else
    {
      return "HH:mm";
    }
  }

  /**
   * Determine time stamp label format for hour interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {string} Moment.js format
   * @static
   */
  static determineHourFormat(d, d_prev) {
    if(TimeGrid.isDayChange(d, d_prev))
    {
      return "ddd D";
    }
    else
    {
      return "HH:mm";
    }
  }

  /**
   * Determine time stamp label format for day interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {string} Moment.js format
   * @static
   */
  static determineDayFormat(d, d_prev) {
    if(TimeGrid.isMonthChange(d, d_prev))
    {
      return "MMM";
    }
    else
    {
      return "D";
    }
  }

  /**
   * Determine time stamp label format for week interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {string} Moment.js format
   * @static
   */
  static determineWeekFormat(d, d_prev) {
    if(TimeGrid.isMonthChange(d, d_prev))
    {
      return "MMM";
    }
    else
    {
      return "D";
    }
  }

  /**
   * Determine time stamp label format for month interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {string} Moment.js format
   * @static
   */
  static determineMonthFormat(d, d_prev) {
    if(TimeGrid.isYearChange(d, d_prev))
    {
      return "YYYY";
    }
    else
    {
      return "MMM";
    }
  }

  /**
   * Determine time stamp label format for quarter interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {string} Moment.js format
   * @static
   */
  static determineQuarterFormat(d, d_prev) {
    if(TimeGrid.isYearChange(d, d_prev))
    {
      return "YYYY";
    }
    else
    {
      return "MMM";
    }
  }

  /**
   * Determine time stamp label format for year interval
   * @param {external:Date} d
   * @param {external:Date} d_prev
   * @returns {string} Moment.js format
   * @static
   */
  static determineYearFormat(d, d_prev) {
    return "'YY";
  }

  /**
   * Determine if a grid line exists at given granularity and time. 
   * @param {string} data_gran
   * @param {number} intervals
   * @param {number} pixel_width
   * @param {number} pixel_spacing
   * @returns {string}
   * @static
   */
  static determineTimeGranularity(data_gran, intervals, pixel_width, pixel_spacing) {

    // e.g. 1000 px / 50 px => 20 divisions
    var div_count = pixel_width / pixel_spacing;

    // e.g. 120 * 15 mins => 1800 minutes
    var mins = intervals * GRANS[data_gran].mins;

    // e.g. 1800 mins / 20 => 90 minutes 
    var interval_t = mins / div_count;

    for(var g in GRANS)
    {
      if(GRANS[g].mins >= interval_t)
      {
        return g;
      }
    }

    return "Y";

  }

}

module.exports = TimeGrid;
