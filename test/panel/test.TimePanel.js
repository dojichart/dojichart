"use strict";

var expect = require("chai").expect;
var TimePanel = require("../../src/panel/TimePanel");

module.exports = function() {

  describe("DojiChart.panel.TimePanel", function() {

    const REGION_NAME = "a-region";
    const CLASS_NAME = "component panel timepanel";
    const PANEL_HEIGHT = 40;

    const PARENT_WIDTH = 50;
    const PARENT_DRAWING_WIDTH = PARENT_WIDTH;

    var HTMLCanvasElement_class = (window.document.createElement("canvas")).constructor; // a workaround to avoid jshint HTMLElement is undefined

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
        },
        getWidth: function() {
          return PARENT_WIDTH;
        },
        getDrawingWidth: function() {
          return PARENT_DRAWING_WIDTH;
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

      var panel;

      beforeEach(function() {
        panel = new TimePanel({
          height: PANEL_HEIGHT
        });
        panel.setParentChart(dummy_parent_chart);
        panel.render(REGION_NAME);
      });

      afterEach(function() {
        region_div.innerHTML = "";
        panel = undefined;
      });

      describe("._parent_chart property", function() {
        it("should equal parent chart instance", function() {
          expect(panel._parent_chart).to.equal(dummy_parent_chart);
        });
      });

      describe(".layers property", function() {
        it("should be empty array", function() {
          expect(panel.layers).to.be.a.array;
          expect(panel.layers.length).to.equal(0);
        });
      });

      describe(".el property", function() {
        it("should be an HTMLElement", function() {
          expect(panel.el).to.be.an.instanceof(HTMLCanvasElement_class);
        });
      });

      describe(".height property", function() {
        it("should have correct value", function() {
          expect(panel.height).to.equal(PANEL_HEIGHT);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var panel;

      beforeEach(function() {
        panel = new TimePanel({
          height: PANEL_HEIGHT
        });
        panel.setParentChart(dummy_parent_chart);
        panel.render(REGION_NAME);
      });

      afterEach(function() {
        region_div.innerHTML = "";
        panel = undefined;
      });

      describe("getClassName()", function() {

        it("should exist", function() {
          expect(panel.getClassName).to.exist;
        });
        it("should return correct value (" + CLASS_NAME + ")", function() {
          expect(panel.getClassName()).to.equal(CLASS_NAME);
        });

      });

      describe("getHeight()", function() {

        it("should exist", function() {
          expect(panel.getHeight).to.exist;
        });
        it("should return correct value (" + PANEL_HEIGHT + ")", function() {
          expect(panel.getHeight()).to.equal(PANEL_HEIGHT);
        });

      });

      describe("getWidth()", function() {

        it("should exist", function() {
          expect(panel.getWidth).to.exist;
        });
        it("should return correct value (" + PARENT_WIDTH + ")", function() {
          expect(panel.getWidth()).to.equal(PARENT_WIDTH);
        });

      });

      describe("getDrawingWidth()", function() {

        it("should exist", function() {
          expect(panel.getDrawingWidth).to.exist;
        });
        it("should return correct value (" + PARENT_DRAWING_WIDTH + ")", function() {
          expect(panel.getDrawingWidth()).to.equal(PARENT_DRAWING_WIDTH);
        });

      });

      describe("getParentChart()", function() {

        it("should exist", function() {
          expect(panel.getParentChart).to.exist;
        });
        it("should return undefined", function() {
          expect(panel.getParentChart()).to.equal(dummy_parent_chart);
        });

      });

      describe("setParentChart()", function() {

        it("should exist", function() {
          expect(panel.setParentChart).to.exist;
        });
        it("should set parent chart property (after has been set)", function() {
          panel.setParentChart(dummy_parent_chart);
          expect(panel._parent_chart).to.equal(dummy_parent_chart);
        });

      });

      describe("getEl()", function() {

        it("should exist", function() {
          expect(panel.getEl).to.exist;
        });
        it("should return HTMLElement (if rendered)", function() {
          panel.setParentChart(dummy_parent_chart);
          panel.render(REGION_NAME);
          expect(panel.getEl()).to.be.an.instanceof(HTMLCanvasElement_class);
        });
        after(function() {
          region_div.innerHTML = "";
        });

      });

      describe("render()", function() {

        it("should exist", function() {
          expect(panel.render).to.exist;
        });

        it("should correctly create HTML", function() {
          var inner_html = region_div.innerHTML;
          var region_child_nodes = region_div.childNodes;
          expect(inner_html).to.be.a("string");
          expect(inner_html).to.not.be.empty;
          expect(region_child_nodes).to.have.lengthOf(1);
          var panel_node = region_child_nodes[0];
          expect(panel_node.nodeName).to.equal("CANVAS");
          expect(panel_node.className).to.equal(CLASS_NAME);
          expect(panel_node.offsetHeight).to.equal(PANEL_HEIGHT);
        });

      });

      describe("destroy()", function() {

        it("should exist", function() {
          expect(panel.destroy).to.exist;
        });
        it("should undefine el property", function() {
          panel.destroy();
          expect(panel.el).to.equal(undefined);
          expect(panel.getEl()).to.equal(undefined);
        });
        it("should empty region DIV element", function() {
          panel.destroy();
          var inner_html = region_div.innerHTML;
          var region_child_nodes = region_div.childNodes;
          expect(inner_html).to.be.a("string");
          expect(inner_html).to.be.empty;
          expect(region_child_nodes).to.have.lengthOf(0);
        });

      });

      describe("addLayer()", function() {

        it("should exist", function() {
          expect(panel.addLayer).to.exist;
        });
        it("should add layer to layers array property", function() {
          var layers_length = panel.layers.length;
          panel.addLayer(dummy_layer);
          expect(panel.layers).to.have.lengthOf(layers_length + 1);
        });

      });

      describe("getAllLayers()", function() {

        it("should exist", function() {
          expect(panel.getAllLayers).to.exist;
        });
        it("should return empty array if no layers added", function() {
          expect(panel.getAllLayers()).to.be.an("array");
          expect(panel.getAllLayers()).to.have.lengthOf(0);
        });
        it("should return array of 1 layer if layer added", function() {
          panel.addLayer(dummy_layer);
          expect(panel.getAllLayers()).to.be.an("array");
          expect(panel.getAllLayers()).to.have.lengthOf(1);
          expect(panel.getAllLayers()[0]).to.equal(dummy_layer);
        });

      });

      describe("removeLayers()", function() {

        it("should exist", function() {
          expect(panel.removeLayers).to.exist;
        });
        it("should not change an empty layer array", function() {
          panel.removeLayers();
          expect(panel.getAllLayers()).to.be.an("array");
          expect(panel.layers).to.have.lengthOf(0);
        });
        it("should empty populated layer array", function() {
          panel.addLayer(dummy_layer);
          expect(panel.layers).to.have.lengthOf(1);
          panel.removeLayers();
          expect(panel.getAllLayers()).to.be.an("array");
          expect(panel.layers).to.have.lengthOf(0);
        });
        it("should leave layer specified as excluded", function() {
          panel.addLayer(dummy_layer);
          expect(panel.layers).to.have.lengthOf(1);
          panel.removeLayers([dummy_layer]);
          expect(panel.getAllLayers()).to.be.an("array");
          expect(panel.layers).to.have.lengthOf(1);
          expect(panel.layers[0]).to.equal(dummy_layer);
        });

      });

      describe("setPrimaryLayer()", function() {

        it("should exist", function() {
          expect(panel.setPrimaryLayer).to.exist;
        });

      });

      describe("precompute()", function() {

        it("should exist", function() {
          expect(panel.precompute).to.exist;
        });

      });

      describe("draw()", function() {

        it("should exist", function() {
          expect(panel.draw).to.exist;
        });

      });

    }); // end of methods

  });

};
