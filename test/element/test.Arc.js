"use strict";

var expect = require("chai").expect;
var Arc = require("../../src/element/Arc");

module.exports = function() {

  describe("DojiChart.element.Arc", function() {

    const DUMMY_LAYER = {};
    const INDEX = 40;
    const TIME = "1";
    const VALUE = 40;
    const DUMMY_PREV_ARC = {
      getIndex: function() { return 10; },
      getValue: function() { return 10; }
    };

    const DUMMY_valueToPixel = function(val) { return Math.ceil(val); };
    const DUMMY_indexToPixel = function(indx) { return Math.ceil(indx); };
    const CONFIG = {
      color: "#FF0000"
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

      var arc;

      beforeEach(function() {
        arc = new Arc(DUMMY_LAYER, INDEX, TIME, VALUE, DUMMY_PREV_ARC);
      });

      afterEach(function() {
        arc = undefined;
      });

      describe(".layer property", function() {
        it("should be correct value", function() {
          expect(arc.layer).to.equal(DUMMY_LAYER);
        });
      });

      describe(".index property", function() {
        it("should be correct value", function() {
          expect(arc.index).to.equal(INDEX);
        });
      });

      describe(".time property", function() {
        it("should be correct value", function() {
          expect(arc.time).to.equal(TIME);
        });
      });

      describe(".value property", function() {
        it("should be correct value", function() {
          expect(arc.value).to.equal(VALUE);
        });
      });

      describe(".previous_arc property", function() {
        it("should be correct value", function() {
          expect(arc.previous_arc).to.equal(DUMMY_PREV_ARC);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var arc;

      beforeEach(function() {
        arc = new Arc(DUMMY_LAYER, INDEX, TIME, VALUE, DUMMY_PREV_ARC);
      });

      afterEach(function() {
        arc = undefined;
      });

      describe("getIndex()", function() {

        it("should exist", function() {
          expect(arc.getIndex).to.exist;
        });
        it("should return correct value", function() {
          expect(arc.getIndex()).to.equal(INDEX);
        });

      });

      describe("getValue()", function() {

        it("should exist", function() {
          expect(arc.getValue).to.exist;
        });
        it("should return correct value", function() {
          expect(arc.getValue()).to.equal(VALUE);
        });

      });

      describe("draw()", function() {

        it("should exist", function() {
          expect(arc.draw).to.exist;
        });
        it("should exist", function() {
          arc.draw(canvas.getContext("2d"), DUMMY_valueToPixel, DUMMY_indexToPixel, CONFIG);
        });

      });

    }); // end of methods

  });

};
