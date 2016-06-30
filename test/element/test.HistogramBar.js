"use strict";

var expect = require("chai").expect;
var HistogramBar = require("../../src/element/HistogramBar");

module.exports = function() {

  describe("DojiChart.element.HistogramBar", function() {

    const DUMMY_LAYER = {};
    const INDEX = 20;
    const TIME = "1";
    const VALUE = 40;

    const DUMMY_valueToPixel = function(val) { return Math.ceil(val); };
    const DUMMY_indexToPixel = function(indx) { return Math.ceil(indx); };
    const CONFIG = {
      barWidth: 8,
      barColor: "blue"
    };

    var test_area, canvas;

    before(function() {
      test_area = window.document.getElementById("canvas-test-area");
      canvas = window.document.createElement("canvas");
      canvas.width = 50;
      canvas.height = 50;
      test_area.appendChild(canvas);
    });

    after(function() {
      //test_area.innerHTML = "";
    });

    describe("properties", function() {

      var bar;

      beforeEach(function() {
        bar = new HistogramBar(DUMMY_LAYER, INDEX, TIME, VALUE);
      });

      afterEach(function() {
        bar = undefined;
      });

      describe(".layer property", function() {
        it("should be correct value", function() {
          expect(bar.layer).to.equal(DUMMY_LAYER);
        });
      });

      describe(".index property", function() {
        it("should be correct value", function() {
          expect(bar.index).to.equal(INDEX);
        });
      });

      describe(".time property", function() {
        it("should be correct value", function() {
          expect(bar.time).to.equal(TIME);
        });
      });

      describe(".value property", function() {
        it("should be correct value", function() {
          expect(bar.value).to.equal(VALUE);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var bar;

      beforeEach(function() {
        bar = new HistogramBar(DUMMY_LAYER, INDEX, TIME, VALUE);
      });

      afterEach(function() {
        bar = undefined;
      });

      describe("getIndex()", function() {

        it("should exist", function() {
          expect(bar.getIndex).to.exist;
        });
        it("should return correct value", function() {
          expect(bar.getIndex()).to.equal(INDEX);
        });

      });

      describe("getValue()", function() {

        it("should exist", function() {
          expect(bar.getValue).to.exist;
        });
        it("should return correct value", function() {
          expect(bar.getValue()).to.equal(VALUE);
        });

      });

      describe("draw()", function() {

        it("should exist", function() {
          expect(bar.draw).to.exist;
        });
        it("should exist", function() {
          bar.draw(canvas.getContext("2d"), DUMMY_valueToPixel, DUMMY_indexToPixel, CONFIG);
        });

      });

    }); // end of methods

  });

};
