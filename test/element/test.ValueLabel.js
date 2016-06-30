"use strict";

var expect = require("chai").expect;
var ValueLabel = require("../../src/element/ValueLabel");

module.exports = function() {

  describe("DojiChart.element.ValueLabel", function() {

    const DUMMY_LAYER = {};
    const VALUE = 25;
    const X = 5;

    const DUMMY_valueToPixel = function(val) { return Math.ceil(val); };
    const DUMMY_indexToPixel = function(indx) { return Math.ceil(indx); };
    const CONFIG = {
      labelColor: "#444444",
      labelFont: "7pt normal normal arial;",
      labelPaddingLeft: 0
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
        label = new ValueLabel(DUMMY_LAYER, VALUE, X);
      });

      afterEach(function() {
        label = undefined;
      });

      describe(".layer property", function() {
        it("should be correct value", function() {
          expect(label.layer).to.equal(DUMMY_LAYER);
        });
      });

      describe(".value property", function() {
        it("should be correct value", function() {
          expect(label.value).to.equal(VALUE);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var label;

      beforeEach(function() {
        label = new ValueLabel(DUMMY_LAYER, VALUE, X);
      });

      afterEach(function() {
        label = undefined;
      });

      describe("getValue()", function() {

        it("should exist", function() {
          expect(label.getValue).to.exist;
        });
        it("should return correct value", function() {
          expect(label.getValue()).to.equal(VALUE);
        });

      });

      describe("draw()", function() {

        it("should exist", function() {
          expect(label.draw).to.exist;
        });
        it("should exist", function() {
          label.draw(canvas.getContext("2d"), DUMMY_valueToPixel, DUMMY_indexToPixel, CONFIG);
        });

      });

    }); // end of methods

  });

};
