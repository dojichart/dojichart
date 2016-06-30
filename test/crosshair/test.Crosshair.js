"use strict";

var expect = require("chai").expect;
var Crosshair = require("../../src/crosshair/Crosshair");

module.exports = function() {

  describe("DojiChart.crosshair.Crosshair", function() {

    const CHART_WIDTH = 200;
    const CHART_HEIGHT = 100;
    const CHART_DRAWING_WIDTH = 150;
    const COMP_HEIGHT = 50;

    const CONFIG = {};

    const DUMMY_pixelToValue = function(px) { return (px * 0.1); };

    //var HTMLElement_class = (window.document.createElement("div")).constructor;
    //var HTMLCanvasElement_class = (window.document.createElement("canvas")).constructor;

    var test_area, dummy_parent_chart, chart_el, comp1_el, comp2_el;

    before(function() {
      test_area = window.document.getElementById("crosshair-test-area");
      test_area.innerHTML = [
        "<div id='ch-chart' class='dojichart' style='width:" + CHART_WIDTH + "px;height:" + CHART_HEIGHT + "px;'>",
          "<div class='region' data-name='region-1'>",
            "<div id='ch-comp1' class='component' style='width:" + CHART_WIDTH + "px;height:" + COMP_HEIGHT + "px;'></div>",
          "</div>",
          "<div class='region' data-name='region-2'>",
            "<div id='ch-comp2' class='component' style='width:" + CHART_WIDTH + "px;height:" + COMP_HEIGHT + "px;'></div>",
          "</div>",
        "</div>"
      ].join("");
      chart_el = window.document.getElementById("ch-chart");
      comp1_el = window.document.getElementById("ch-comp1");
      comp2_el = window.document.getElementById("ch-comp2");
      dummy_parent_chart = {
        getEl: function() {
          return chart_el;
        },
        getWidth: function() {
          return CHART_WIDTH;
        },
        getDrawingWidth: function() {
          return CHART_DRAWING_WIDTH;
        },
        getComponents: function() {
          return [
            {
              getClassName: function() { return "comp1"; },
              getEl: function() { return comp1_el; },
              getWidth: function() { return CHART_WIDTH; },
              getHeight: function() { return COMP_HEIGHT; },
              pixelToValue: DUMMY_pixelToValue
            },
            {
              getClassName: function() { return "comp2"; },
              getEl: function() { return comp2_el; },
              getWidth: function() { return CHART_WIDTH; },
              getHeight: function() { return COMP_HEIGHT; },
              pixelToValue: DUMMY_pixelToValue
            }
          ];
        }
      };
    });

    describe("Test area (fixture)", function() {

      it("exist", function() {
        expect(test_area).to.exist;
      });

    }); // end of fixtures

    describe("constructor", function() {

      var crosshair;

      afterEach(function() {
        crosshair = undefined;
        //test_area.innerHTML = "";
      });

      it("should instantiate without error", function() {
        crosshair = new Crosshair(dummy_parent_chart, CONFIG);
      });

    }); // end of properties

    describe("properties", function() {

      var crosshair;

      beforeEach(function() {
        //crosshair = new Crosshair(dummy_parent_chart, CONFIG);
      });

      afterEach(function() {
        crosshair = undefined;
        //test_area.innerHTML = "";
      });

    }); // end of properties

    describe("methods", function() {

      var crosshair;

      beforeEach(function() {
        //crosshair = new Crosshair(dummy_parent_chart, CONFIG);
      });

      afterEach(function() {
        crosshair = undefined;
        //test_area.innerHTML = "";
      });

      /*
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
          crosshair.setParentChart(dummy_parent_chart);
          expect(comp._parent_chart).to.equal(dummy_parent_chart);
        });

      });

      describe("getEl()", function() {

        it("should exist", function() {
          expect(comp.getEl).to.exist;
        });
        it("should return HTMLElement (if rendered)", function() {
          crosshair.setParentChart(dummy_parent_chart);
          crosshair.render(REGION_NAME);
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
          var crosshair_node = region_child_nodes[0];
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
          crosshair.destroy();
          expect(comp.el).to.equal(undefined);
          expect(comp.getEl()).to.equal(undefined);
        });
        it("should empty region DIV element", function() {
          crosshair.destroy();
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
          var layers_length = crosshair.layers.length;
          crosshair.addLayer(dummy_layer);
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
          crosshair.addLayer(dummy_layer);
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
          crosshair.removeLayers();
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.layers).to.have.lengthOf(0);
        });
        it("should empty populated layer array", function() {
          crosshair.addLayer(dummy_layer);
          expect(comp.layers).to.have.lengthOf(1);
          crosshair.removeLayers();
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.layers).to.have.lengthOf(0);
        });
        it("should leave layer specified as excluded", function() {
          crosshair.addLayer(dummy_layer);
          expect(comp.layers).to.have.lengthOf(1);
          crosshair.removeLayers([dummy_layer]);
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.layers).to.have.lengthOf(1);
          expect(comp.layers[0]).to.equal(dummy_layer);
        });

      });
      */

    }); // end of methods

  });

};
