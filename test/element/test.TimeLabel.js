"use strict";

var expect = require("chai").expect;
var TimeLabel = require("../../src/element/TimeLabel");

module.exports = function() {

  describe("DojiChart.element.TimeLabel", function() {

    const DUMMY_LAYER = {};
    const INDEX = 25;
    const TIME = "2015-11-15T22:45:00.000000Z";
    const FORMAT = "ddd D MMM YYYY HH:mm";

    const DUMMY_indexToPixel = function(indx) { return Math.ceil(indx); };
    const CONFIG = {
      labelColor: "#444444",
      labelFont: "7pt normal normal arial;",
      labelY: 25
    };

    var test_area, canvas;

    before(function() {
      test_area = window.document.getElementById("canvas-test-area");
      canvas = window.document.createElement("canvas");
      canvas.width = 150;
      canvas.height = 50;
      test_area.appendChild(canvas);
    });

    after(function() {
      //test_area.innerHTML = "";
    });

    describe("properties", function() {

      var label;

      beforeEach(function() {
        label = new TimeLabel(DUMMY_LAYER, INDEX, TIME, FORMAT);
      });

      afterEach(function() {
        label = undefined;
      });

      describe(".layer property", function() {
        it("should be correct value", function() {
          expect(label.layer).to.equal(DUMMY_LAYER);
        });
      });

      describe(".index property", function() {
        it("should be correct value", function() {
          expect(label.index).to.equal(INDEX);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var label;

      beforeEach(function() {
        label = new TimeLabel(DUMMY_LAYER, INDEX, TIME, FORMAT);
      });

      afterEach(function() {
        label = undefined;
      });

      describe("getIndex()", function() {

        it("should exist", function() {
          expect(label.getIndex).to.exist;
        });
        it("should return correct value", function() {
          expect(label.getIndex()).to.equal(INDEX);
        });

      });

      describe("draw()", function() {

        it("should exist", function() {
          expect(label.draw).to.exist;
        });
        it("should exist", function() {
          label.draw(canvas.getContext("2d"), DUMMY_indexToPixel, CONFIG);
        });

      });

    }); // end of methods

  });

};
