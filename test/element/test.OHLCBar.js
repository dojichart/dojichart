"use strict";

var expect = require("chai").expect;
var OHLCBar = require("../../src/element/OHLCBar");

module.exports = function() {

  describe("DojiChart.element.OHLCBar", function() {

    const DUMMY_LAYER = {};
    const INDEX = 20;
    const TIME = "1";
    const OPEN = 21; // 21 / 29
    const HIGH = 10;
    const LOW = 40;
    const CLOSE = 29; // 29 / 21

    const DUMMY_valueToPixel = function(val) { return Math.ceil(val); };
    const DUMMY_indexToPixel = function(indx) { return Math.ceil(indx); };

    const CONFIG = {
      bullBodyColor: "green",
      bearBodyColor: "red",
      candleWickWidth: 1,
      candleBodyWidth: 7
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
        bar = new OHLCBar(DUMMY_LAYER, INDEX, TIME, OPEN, HIGH, LOW, CLOSE);
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

      describe(".open property", function() {
        it("should be correct value", function() {
          expect(bar.open).to.equal(OPEN);
        });
      });

      describe(".high property", function() {
        it("should be correct value", function() {
          expect(bar.high).to.equal(HIGH);
        });
      });

      describe(".low property", function() {
        it("should be correct value", function() {
          expect(bar.low).to.equal(LOW);
        });
      });

      describe(".close property", function() {
        it("should be correct value", function() {
          expect(bar.close).to.equal(CLOSE);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var bar;

      beforeEach(function() {
        bar = new OHLCBar(DUMMY_LAYER, INDEX, TIME, OPEN, HIGH, LOW, CLOSE);
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

      describe("getOpen()", function() {

        it("should exist", function() {
          expect(bar.getOpen).to.exist;
        });
        it("should return correct value", function() {
          expect(bar.getOpen()).to.equal(OPEN);
        });

      });

      describe("getHigh()", function() {

        it("should exist", function() {
          expect(bar.getHigh).to.exist;
        });
        it("should return correct value", function() {
          expect(bar.getHigh()).to.equal(HIGH);
        });

      });

      describe("getLow()", function() {

        it("should exist", function() {
          expect(bar.getLow).to.exist;
        });
        it("should return correct value", function() {
          expect(bar.getLow()).to.equal(LOW);
        });

      });

      describe("getClose()", function() {

        it("should exist", function() {
          expect(bar.getClose).to.exist;
        });
        it("should return correct value", function() {
          expect(bar.getClose()).to.equal(CLOSE);
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
