"use strict";

var expect = require("chai").expect;
var Candle = require("../../src/element/Candle");

module.exports = function() {

  describe("DojiChart.element.Candle", function() {

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
      candleBodyWidth: 7,
      wickColor: "black"
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

      var candle;

      beforeEach(function() {
        candle = new Candle(DUMMY_LAYER, INDEX, TIME, OPEN, HIGH, LOW, CLOSE);
      });

      afterEach(function() {
        candle = undefined;
      });

      describe(".layer property", function() {
        it("should be correct value", function() {
          expect(candle.layer).to.equal(DUMMY_LAYER);
        });
      });

      describe(".index property", function() {
        it("should be correct value", function() {
          expect(candle.index).to.equal(INDEX);
        });
      });

      describe(".time property", function() {
        it("should be correct value", function() {
          expect(candle.time).to.equal(TIME);
        });
      });

      describe(".open property", function() {
        it("should be correct value", function() {
          expect(candle.open).to.equal(OPEN);
        });
      });

      describe(".high property", function() {
        it("should be correct value", function() {
          expect(candle.high).to.equal(HIGH);
        });
      });

      describe(".low property", function() {
        it("should be correct value", function() {
          expect(candle.low).to.equal(LOW);
        });
      });

      describe(".close property", function() {
        it("should be correct value", function() {
          expect(candle.close).to.equal(CLOSE);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var candle;

      beforeEach(function() {
        candle = new Candle(DUMMY_LAYER, INDEX, TIME, OPEN, HIGH, LOW, CLOSE);
      });

      afterEach(function() {
        candle = undefined;
      });

      describe("getIndex()", function() {

        it("should exist", function() {
          expect(candle.getIndex).to.exist;
        });
        it("should return correct value", function() {
          expect(candle.getIndex()).to.equal(INDEX);
        });

      });

      describe("getOpen()", function() {

        it("should exist", function() {
          expect(candle.getOpen).to.exist;
        });
        it("should return correct value", function() {
          expect(candle.getOpen()).to.equal(OPEN);
        });

      });

      describe("getHigh()", function() {

        it("should exist", function() {
          expect(candle.getHigh).to.exist;
        });
        it("should return correct value", function() {
          expect(candle.getHigh()).to.equal(HIGH);
        });

      });

      describe("getLow()", function() {

        it("should exist", function() {
          expect(candle.getLow).to.exist;
        });
        it("should return correct value", function() {
          expect(candle.getLow()).to.equal(LOW);
        });

      });

      describe("getClose()", function() {

        it("should exist", function() {
          expect(candle.getClose).to.exist;
        });
        it("should return correct value", function() {
          expect(candle.getClose()).to.equal(CLOSE);
        });

      });

      describe("draw()", function() {

        it("should exist", function() {
          expect(candle.draw).to.exist;
        });
        it("should exist", function() {
          candle.draw(canvas.getContext("2d"), DUMMY_valueToPixel, DUMMY_indexToPixel, CONFIG);
        });

      });

    }); // end of methods

  });

};
