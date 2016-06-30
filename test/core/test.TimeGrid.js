"use strict";

var expect = require("chai").expect;
var TimeGrid = require("../../src/core/TimeGrid");

module.exports = function() {

  describe("DojiChart.core.TimeGrid", function() {

    const CONFIG = {};

    // e.g. 1000 px / 50 px => 20 divisions
    //var div_count = pixel_width / pixel_spacing;

    // e.g. 120 * 15 mins => 1800 minutes
    //var mins = intervals * GRANS[data_gran].mins;

    // e.g. 1800 mins / 20 => 90 minutes 
    //var interval_t = mins / div_count;

    // 90 minutes > 1 hour && < 90 minutes < 4 hours
    // => H4

    const DATA_GRAN = "M15";
    const INTERVALS = 120;
    const PIXEL_WIDTH = 1000;
    const PIXEL_SPACING = 50;
    const EXPECTED_GRAN = "H4";

    describe("properties", function() {

      var time_grid;

      beforeEach(function() {
        time_grid = new TimeGrid(CONFIG);
      });

      afterEach(function() {
        time_grid = undefined;
      });

      describe("._config property", function() {
        it("should exist", function() {
          expect(time_grid._config).to.exist;
        });
      });

    }); // end of properties

    describe("methods", function() {

      var time_grid;

      beforeEach(function() {
        time_grid = new TimeGrid(CONFIG);
      });

      afterEach(function() {
        time_grid = undefined;
      });

      describe("getConfig()", function() {

        it("should exist", function() {
          expect(time_grid.getConfig).to.exist;
        });

      });

      describe("static determineTimeGranularity()", function() {

        it("should exist", function() {
          expect(time_grid.getConfig).to.exist;
        });
        it("should return expected value", function() {
          var gran = TimeGrid.determineTimeGranularity(DATA_GRAN, INTERVALS, PIXEL_WIDTH, PIXEL_SPACING);
          expect(gran).to.equal(EXPECTED_GRAN);
        });

      });

    }); // end of methods

  });

};
