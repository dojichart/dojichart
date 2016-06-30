"use strict";

var expect = require("chai").expect;
var VerticalLine = require("../../src/element/VerticalLine");

module.exports = function() {

  describe("DojiChart.element.VerticalLine", function() {

    const DUMMY_LAYER = {};
    const INDEX = 25.5;
    const START = 5;
    const END = 45;

    const DUMMY_valueToPixel = function(val) { return val; };
    const DUMMY_indexToPixel = function(indx) { return indx; };
    const CONFIG = {
      lineColor: "black"
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

      var line;

      beforeEach(function() {
        line = new VerticalLine(DUMMY_LAYER, INDEX, START, END);
      });

      afterEach(function() {
        line = undefined;
      });

      describe(".layer property", function() {
        it("should be correct value", function() {
          expect(line.layer).to.equal(DUMMY_LAYER);
        });
      });

      describe(".index property", function() {
        it("should be correct value", function() {
          expect(line.index).to.equal(INDEX);
        });
      });

      describe(".start property", function() {
        it("should be correct value", function() {
          expect(line.start).to.equal(START);
        });
      });

      describe(".end property", function() {
        it("should be correct value", function() {
          expect(line.end).to.equal(END);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var line;

      beforeEach(function() {
        line = new VerticalLine(DUMMY_LAYER, INDEX, START, END);
      });

      afterEach(function() {
        line = undefined;
      });

      describe("getIndex()", function() {

        it("should exist", function() {
          expect(line.getIndex).to.exist;
        });
        it("should return correct value", function() {
          expect(line.getIndex()).to.equal(INDEX);
        });

      });

      describe("getStart()", function() {

        it("should exist", function() {
          expect(line.getStart).to.exist;
        });
        it("should return correct value", function() {
          expect(line.getStart()).to.equal(START);
        });

      });

      describe("getEnd()", function() {

        it("should exist", function() {
          expect(line.getEnd).to.exist;
        });
        it("should return correct value", function() {
          expect(line.getEnd()).to.equal(END);
        });

      });

      describe("draw()", function() {

        it("should exist", function() {
          expect(line.draw).to.exist;
        });
        it("should exist", function() {
          line.draw(canvas.getContext("2d"), DUMMY_valueToPixel, DUMMY_indexToPixel, CONFIG);
        });

      });

    }); // end of methods

  });

};
