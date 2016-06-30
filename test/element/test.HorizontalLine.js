"use strict";

var expect = require("chai").expect;
var HorizontalLine = require("../../src/element/HorizontalLine");

module.exports = function() {

  describe("DojiChart.element.HorizontalLine", function() {

    const DUMMY_LAYER = {};
    const VALUE = 25.5;
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
        line = new HorizontalLine(DUMMY_LAYER, VALUE, START, END);
      });

      afterEach(function() {
        line = undefined;
      });

      describe(".layer property", function() {
        it("should be correct value", function() {
          expect(line.layer).to.equal(DUMMY_LAYER);
        });
      });

      describe(".value property", function() {
        it("should be correct value", function() {
          expect(line.value).to.equal(VALUE);
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
        line = new HorizontalLine(DUMMY_LAYER, VALUE, START, END);
      });

      afterEach(function() {
        line = undefined;
      });

      describe("getValue()", function() {

        it("should exist", function() {
          expect(line.getValue).to.exist;
        });
        it("should return correct value", function() {
          expect(line.getValue()).to.equal(VALUE);
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
