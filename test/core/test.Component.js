"use strict";

var expect = require("chai").expect;
var Component = require("../../src/core/Component");

module.exports = function() {

  describe("DojiChart.core.Component", function() {

    const REGION_NAME = "a-region";
    const CLASS_NAME = "component";
    const COMPONENT_HEIGHT = 40;

    var HTMLElement_class = (window.document.createElement("div")).constructor; // a workaround to avoid jshint HTMLElement is undefined

    var test_area, chart_div, region_div, dummy_parent_chart, dummy_layer;

    before(function() {
      test_area = window.document.getElementById("test-area");
      test_area.innerHTML = ["<div class='dojichart' id='my-dojichart'>",
                             "<div id='test-region' class='region' data-name='" + REGION_NAME + "'></div>",
                             "</div>"].join("");
      chart_div = window.document.getElementById("my-dojichart");
      region_div = window.document.getElementById("test-region");
      dummy_parent_chart = {
        getEl: function() {
          return chart_div;
        }
      };
      dummy_layer = {
        setParentComponent: function() { }
      };
    });

    describe("region DIV (fixture)", function() {

      it("exist", function() {
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

    }); // end of fixtures

    describe("properties", function() {

      var comp;

      beforeEach(function() {
        comp = new Component({
          height: COMPONENT_HEIGHT
        });
        comp.setParentChart(dummy_parent_chart);
        comp.render(REGION_NAME);
      });

      afterEach(function() {
        region_div.innerHTML = "";
        comp = undefined;
      });

      describe("._parent_chart property", function() {
        it("should equal parent chart instance", function() {
          expect(comp._parent_chart).to.equal(dummy_parent_chart);
        });
      });

      describe(".layers property", function() {
        it("should be empty array", function() {
          expect(comp.layers).to.be.a.array;
          expect(comp.layers.length).to.equal(0);
        });
      });

      describe(".el property", function() {
        it("should be an HTMLElement", function() {
          expect(comp.el).to.be.an.instanceof(HTMLElement_class);
        });
      });

      describe(".height property", function() {
        it("should have correct value", function() {
          expect(comp.height).to.equal(COMPONENT_HEIGHT);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var comp;

      beforeEach(function() {
        comp = new Component({
          height: COMPONENT_HEIGHT
        });
        comp.setParentChart(dummy_parent_chart);
        comp.render(REGION_NAME);
      });

      afterEach(function() {
        region_div.innerHTML = "";
        comp = undefined;
      });

      describe("getClassName()", function() {

        it("should exist", function() {
          expect(comp.getClassName).to.exist;
        });
        it("should return correct value (" + CLASS_NAME + ")", function() {
          expect(comp.getClassName()).to.equal(CLASS_NAME);
        });

      });

      describe("getHeight()", function() {

        it("should exist", function() {
          expect(comp.getHeight).to.exist;
        });
        it("should return correct value (" + COMPONENT_HEIGHT + ")", function() {
          expect(comp.getHeight()).to.equal(COMPONENT_HEIGHT);
        });

      });

      describe("getParentChart()", function() {

        it("should exist", function() {
          expect(comp.getParentChart).to.exist;
        });
        it("should return undefined", function() {
          expect(comp.getParentChart()).to.equal(dummy_parent_chart);
        });

      });

      describe("setParentChart()", function() {

        it("should exist", function() {
          expect(comp.setParentChart).to.exist;
        });
        it("should set parent chart property (after has been set)", function() {
          comp.setParentChart(dummy_parent_chart);
          expect(comp._parent_chart).to.equal(dummy_parent_chart);
        });

      });

      describe("getEl()", function() {

        it("should exist", function() {
          expect(comp.getEl).to.exist;
        });
        it("should return HTMLElement (if rendered)", function() {
          comp.setParentChart(dummy_parent_chart);
          comp.render(REGION_NAME);
          expect(comp.getEl()).to.be.an.instanceof(HTMLElement_class);
        });
        after(function() {
          region_div.innerHTML = "";
        });

      });

      describe("render()", function() {

        it("should exist", function() {
          expect(comp.render).to.exist;
        });

        it("should correctly create HTML", function() {
          var inner_html = region_div.innerHTML;
          var region_child_nodes = region_div.childNodes;
          expect(inner_html).to.be.a("string");
          expect(inner_html).to.not.be.empty;
          expect(region_child_nodes).to.have.lengthOf(1);
          var comp_node = region_child_nodes[0];
          expect(comp_node.nodeName).to.equal("DIV");
          expect(comp_node.className).to.equal(CLASS_NAME);
          expect(comp_node.offsetHeight).to.equal(COMPONENT_HEIGHT);
        });

      });

      describe("destroy()", function() {

        it("should exist", function() {
          expect(comp.destroy).to.exist;
        });
        it("should undefine el property", function() {
          comp.destroy();
          expect(comp.el).to.equal(undefined);
          expect(comp.getEl()).to.equal(undefined);
        });
        it("should empty region DIV element", function() {
          comp.destroy();
          var inner_html = region_div.innerHTML;
          var region_child_nodes = region_div.childNodes;
          expect(inner_html).to.be.a("string");
          expect(inner_html).to.be.empty;
          expect(region_child_nodes).to.have.lengthOf(0);
        });

      });

      describe("addLayer()", function() {

        it("should exist", function() {
          expect(comp.addLayer).to.exist;
        });
        it("should add layer to layers array property", function() {
          var layers_length = comp.layers.length;
          comp.addLayer(dummy_layer);
          expect(comp.layers).to.have.lengthOf(layers_length + 1);
        });

      });

      describe("getAllLayers()", function() {

        it("should exist", function() {
          expect(comp.getAllLayers).to.exist;
        });
        it("should return empty array if no layers added", function() {
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.getAllLayers()).to.have.lengthOf(0);
        });
        it("should return array of 1 layer if layer added", function() {
          comp.addLayer(dummy_layer);
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.getAllLayers()).to.have.lengthOf(1);
          expect(comp.getAllLayers()[0]).to.equal(dummy_layer);
        });

      });

      describe("removeLayers()", function() {

        it("should exist", function() {
          expect(comp.removeLayers).to.exist;
        });
        it("should not change an empty layer array", function() {
          comp.removeLayers();
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.layers).to.have.lengthOf(0);
        });
        it("should empty populated layer array", function() {
          comp.addLayer(dummy_layer);
          expect(comp.layers).to.have.lengthOf(1);
          comp.removeLayers();
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.layers).to.have.lengthOf(0);
        });
        it("should leave layer specified as excluded", function() {
          comp.addLayer(dummy_layer);
          expect(comp.layers).to.have.lengthOf(1);
          comp.removeLayers([dummy_layer]);
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.layers).to.have.lengthOf(1);
          expect(comp.layers[0]).to.equal(dummy_layer);
        });

      });

    }); // end of methods

  });

};
