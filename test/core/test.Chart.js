"use strict";

var expect = require("chai").expect;
var Chart = require("../../src/core/Chart");

module.exports = function() {

  describe("DojiChart.core.Chart", function() {

    const WIDTH = 200;

    const CONFIG = {
      width: WIDTH
    };

    var HTMLElement_class = (window.document.createElement("div")).constructor; // a workaround to avoid jshint HTMLElement is undefined

    var test_area, chart_div;

    before(function() {
      test_area = window.document.getElementById("test-area");
      test_area.innerHTML = ["<div class='dojichart' id='my-dojichart'>",
                             "<div class='region' data-name='region-1'></div>",
                             "<div class='region' data-name='region-2'></div>",
                             "</div>"].join("");
      chart_div = window.document.getElementById("my-dojichart");
    });

    describe("test area DIV and chart DIV (fixtures)", function() {

      it("should exist", function() {
        expect(test_area).to.exist;
        expect(chart_div).to.exist;
      });

      it("should be an HTMLElement", function() {
        expect(test_area).to.be.an.instanceof(HTMLElement_class);
        expect(chart_div).to.be.an.instanceof(HTMLElement_class);
      });

      it("chart DIV should contain 2 region DIVs", function() {
        var child_nodes = chart_div.childNodes;
        expect(child_nodes).to.have.lengthOf(2);
        for(var c = 0; c < child_nodes.length; c++)
        {
          var node = child_nodes[c];
          expect(node).to.be.an.instanceof(HTMLElement_class);
          expect(node.nodeName).to.equal("DIV");
          expect(node.className).to.equal("region");
          expect(node.getAttribute("data-name")).to.match(/^region-[12]/);
          expect(node.innerHTML).to.equal("");
        }
      });

    }); // end of fixtures

    describe("properties", function() {

      var chart;

      beforeEach(function() {
        chart = new Chart(chart_div, CONFIG);
      });

      afterEach(function() {
        test_area.innerHTML = "";
        chart = undefined;
      });

      describe("._el property", function() {
        it("should be an HTMLElement", function() {
          expect(chart._el).to.be.an.instanceof(HTMLElement_class);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var chart;

      beforeEach(function() {
        chart = new Chart(chart_div, CONFIG);
      });

      afterEach(function() {
        test_area.innerHTML = "";
        chart = undefined;
      });

      describe("getWith()", function() {

        it("should exist", function() {
          expect(chart.getWidth).to.exist;
        });
        it("should return correct value", function() {
          expect(chart.getWidth()).to.equal(WIDTH);
        });

      });

      describe("getEl()", function() {

        it("should exist", function() {
          expect(chart.getEl).to.exist;
        });
        it("should return HTMLElement (if rendered)", function() {
          expect(chart.getEl()).to.be.an.instanceof(HTMLElement_class);
        });
        it("should return value equal to ._el property", function() {
          expect(chart.getEl()).to.equal(chart._el);
        });

      });

      describe("isScrollOffsetFromEnd()", function() {

        it("should exist", function() {
          expect(chart.isScrollOffsetFromEnd).to.exist;
        });
        it("should return correct value", function() {
          chart.offsetFromEnd = true;
          expect(chart.isScrollOffsetFromEnd()).to.be.true;
          chart.offsetFromEnd = false;
          expect(chart.isScrollOffsetFromEnd()).to.be.false;
        });

      });

      describe("isBeyondStart()", function() {

        it("should exist", function() {
          expect(chart.isBeyondStart).to.exist;
        });
        it("should return correct value", function() {
          chart.offset = 0;
          expect(chart.isBeyondStart()).to.be.false;
          chart.offset = 1;
          expect(chart.isBeyondStart()).to.be.false;
          chart.offset = (-1);
          expect(chart.isBeyondStart()).to.be.true;
        });

      });

    }); // end of methods

  });

};
