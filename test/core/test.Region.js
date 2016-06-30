"use strict";

var expect = require("chai").expect;
var Region = require("../../src/core/Region");

module.exports = function() {

  describe("DojiChart.core.Region", function() {

    const REGION_NAME = "a-region";
    const REGION_HEIGHT = 40;

    var test_area, region_div, region;

    before(function() {
      test_area = window.document.getElementById("test-area");
      test_area.innerHTML = "<div id='test-region' class='region' data-name='" + REGION_NAME + "'></div>";
      region_div = window.document.getElementById("test-region");
      region_div.style.height = REGION_HEIGHT + "px";
      region = new Region(region_div);
    });

    describe("underlying DIV element", function() {

      it("exists", function() {
        expect(region_div).to.exist;
      });

      it("has class name = 'region'", function() {
        expect(region_div.className).to.equal("region");
      });

      it("has data-name = 'a-region'", function() {
        expect(region_div.getAttribute("data-name")).to.equal(REGION_NAME);
      });

      it("empty element", function() {
        expect(region_div.innerHTML).to.equal("");
      });

    });

    describe("region instance", function() {

      it("should exist", function() {
        expect(region).to.exist;
      });

      describe(".el property", function() {
        it("should be the region DIV", function() {
          expect(region.el).to.equal(region_div);
        });
      });

      describe(".name property", function() {
        it("should be correct value (" + REGION_NAME + ")", function() {
          expect(region.name).to.equal(REGION_NAME);
        });
      });

      describe("getEl()", function() {
        it("should exist", function() {
          expect(region.getEl).to.exist;
        });
        it("should return region DIV", function() {
          expect(region.getEl()).to.equal(region_div);
        });
      });

      describe("getName()", function() {
        it("should exist", function() {
          expect(region.getName).to.exist;
        });
        it("should return correct value (" + REGION_NAME + ")", function() {
          expect(region.getName()).to.equal(REGION_NAME);
        });
      });
      
      describe("getHeight()", function() {
        it("should exist", function() {
          expect(region.getHeight).to.exist;
        });
        it("should return correct height (" + REGION_HEIGHT + ")", function() {
          expect(region.getHeight()).to.equal(REGION_HEIGHT);
        });
      });

    });
    
    describe("static getRegionsByName()", function() {

      it("should exist", function() {
        expect(Region.getRegionsByName).to.exist;
      });
      it("should return 1 region", function() {
        var regions_by_name = Region.getRegionsByName(test_area);
        var keys = Object.keys(regions_by_name);
        expect(keys.length).to.equal(1);
      });

    });

  });

};
