"use strict";

var expect = require("chai").expect;
var TimeSeriesData = require("../../src/timeseries/TimeSeriesData");

module.exports = function() {

  describe("DojiChart.timeseries.TimeSeriesData", function() {

    const RAW_DATA = [{l:1,h:2},{l:1.5,h:3}];
    const FIELD_MAP = {
      time: "t",
      open: "o",
      high: "h",
      low: "l",
      close: "c",
      volume: "v"
    };
    const SYMBOL = "EURUSD";
    const GRAN = "M5";
    const CONFIG = {};

    const MIN_FIELD = "low";
    const MAX_FIELD = "high";
    const MIN_VALUE = 1;
    const MAX_VALUE = 3;

    const COUNT = 2;
    const OFFSET = 0;
    const MIN_AND_MAX_FIELDS = {min:MIN_FIELD, max:MAX_FIELD};
    const MIN_AND_MAX_VALUES = {min:MIN_VALUE, max:MAX_VALUE};

    describe("properties", function() {

      var time_series_data;

      beforeEach(function() {
        time_series_data = new TimeSeriesData(RAW_DATA, FIELD_MAP, SYMBOL, GRAN, CONFIG);
      });

      afterEach(function() {
        time_series_data = undefined;
      });

      describe("._config property", function() {
        it("should exist", function() {
          expect(time_series_data._config).to.exist;
        });
      });

      describe("._raw_data property", function() {
        it("should exist", function() {
          expect(time_series_data._raw_data).to.exist;
        });
        it("should have correct value", function() {
          expect(time_series_data._raw_data).to.equal(RAW_DATA);
        });
      });

      describe("._field_map property", function() {
        it("should exist", function() {
          expect(time_series_data._field_map).to.exist;
        });
        it("should have correct value", function() {
          expect(time_series_data._field_map).to.equal(FIELD_MAP);
        });
      });

      describe("._symbol property", function() {
        it("should exist", function() {
          expect(time_series_data._symbol).to.exist;
        });
        it("should have correct value", function() {
          expect(time_series_data._symbol).to.equal(SYMBOL);
        });
      });

      describe("._granularity property", function() {
        it("should exist", function() {
          expect(time_series_data._granularity).to.exist;
        });
        it("should have correct value", function() {
          expect(time_series_data._granularity).to.equal(GRAN);
        });
      });


    }); // end of properties

    describe("methods", function() {

      var time_series_data;

      beforeEach(function() {
        time_series_data = new TimeSeriesData(RAW_DATA, FIELD_MAP, SYMBOL, GRAN, CONFIG);
      });

      afterEach(function() {
        time_series_data = undefined;
      });

      describe("getRawData()", function() {

        it("should exist", function() {
          expect(time_series_data.getRawData).to.exist;
        });
        it("should return correct value", function() {
          expect(time_series_data.getRawData()).to.equal(RAW_DATA);
        });

      });

      describe("getFieldMap()", function() {

        it("should exist", function() {
          expect(time_series_data.getFieldMap).to.exist;
        });
        it("should return correct value", function() {
          expect(time_series_data.getFieldMap()).to.equal(FIELD_MAP);
        });

      });

      describe("getSymbol()", function() {

        it("should exist", function() {
          expect(time_series_data.getSymbol).to.exist;
        });
        it("should return correct value", function() {
          expect(time_series_data.getSymbol()).to.equal(SYMBOL);
        });

      });

      describe("getGranularity()", function() {

        it("should exist", function() {
          expect(time_series_data.getGranularity).to.exist;
        });
        it("should return correct value", function() {
          expect(time_series_data.getGranularity()).to.equal(GRAN);
        });

      });

      describe("findValueBounds()", function() {

        it("should exist", function() {
          expect(time_series_data.findValueBounds).to.exist;
        });
        it("should return correct value when fields are supplied", function() {
          var value_bounds = time_series_data.findValueBounds(COUNT, OFFSET, MIN_AND_MAX_FIELDS, {min:undefined,max:undefined});
          expect(value_bounds.min).to.equal(MIN_VALUE);
          expect(value_bounds.max).to.equal(MAX_VALUE);
        });
        it("should return correct value when values are supplied", function() {
          var value_bounds = time_series_data.findValueBounds(COUNT, OFFSET, {min:undefined,max:undefined}, MIN_AND_MAX_VALUES);
          expect(value_bounds.min).to.equal(MIN_VALUE);
          expect(value_bounds.max).to.equal(MAX_VALUE);
        });
        it("should return correct value when min field and max value supplied", function() {
          var value_bounds = time_series_data.findValueBounds(COUNT, OFFSET, {min:MIN_FIELD,max:undefined}, {min:undefined,max:MAX_VALUE});
          expect(value_bounds.min).to.equal(MIN_VALUE);
          expect(value_bounds.max).to.equal(MAX_VALUE);
        });
        it("should return correct value when max field and min value supplied", function() {
          var value_bounds = time_series_data.findValueBounds(COUNT, OFFSET, {min:undefined,max:MAX_FIELD}, {min:MIN_VALUE,max:undefined});
          expect(value_bounds.min).to.equal(MIN_VALUE);
          expect(value_bounds.max).to.equal(MAX_VALUE);
        });
        it("should return correct value when only max field supplied", function() {
          var value_bounds = time_series_data.findValueBounds(COUNT, OFFSET, {min:undefined,max:MAX_FIELD}, {min:undefined,max:undefined});
          expect(value_bounds.min).to.equal(0);
          expect(value_bounds.max).to.equal(MAX_VALUE);
        });
        it("should return correct value when only max value supplied", function() {
          var value_bounds = time_series_data.findValueBounds(COUNT, OFFSET, {min:undefined,max:undefined}, {min:undefined,max:MAX_VALUE});
          expect(value_bounds.min).to.equal(0);
          expect(value_bounds.max).to.equal(MAX_VALUE);
        });

      });


    }); // end of methods

  });

};
