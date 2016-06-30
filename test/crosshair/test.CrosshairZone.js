"use strict";

var expect = require("chai").expect;
var CrosshairZone = require("../../src/crosshair/CrosshairZone");

module.exports = function() {

  describe("DojiChart.crosshair.CrosshairZone", function() {

    const CHART_WIDTH = 200;
    const CHART_HEIGHT = 100;
    const COMP_HEIGHT = 50;
    const COMP_CLASS_NAME = "component";
    const ZONE_INDEX = 0;
    const EXPECTED_NAME = "crosshair-component";
    const EXPECTED_CLASS_NAME = "crosshair crosshair-component";

    var HTMLElement_class = (window.document.createElement("div")).constructor;
    var HTMLCanvasElement_class = (window.document.createElement("canvas")).constructor;

    var test_area, dummy_parent_crosshair, dummy_component, chart_el, region_el, comp_el;

    function initFixtures() {
      test_area = window.document.getElementById("crosshair-zone-test-area");
      test_area.innerHTML = [
        "<div id='chz-chart' class='dojichart' style='width:" + CHART_WIDTH + "px;height:" + CHART_HEIGHT + "px;'>",
          "<div id='chz-region' class='region' data-name='region-1'>",
            "<div id='chz-comp' class='" + COMP_CLASS_NAME + "' style='width:" + CHART_WIDTH + "px;height:" + COMP_HEIGHT + "px;'></div>",
          "</div>",
        "</div>"
      ].join("");
      chart_el = window.document.getElementById("chz-chart");
      region_el = window.document.getElementById("chz-region");
      comp_el = window.document.getElementById("chz-comp");
      dummy_parent_crosshair = {
      };
      dummy_component = {
        getClassName: function() {
          return COMP_CLASS_NAME;
        },
        getEl: function() {
          return comp_el;
        },
        getWidth: function() {
          return CHART_WIDTH;
        },
        getHeight: function() {
          return COMP_HEIGHT;
        }
      };
    }

    function deinitFixtures() {
      test_area.innerHTML = "";
      chart_el = undefined;
      region_el = undefined;
      comp_el = undefined;
      dummy_parent_crosshair = undefined;
      dummy_component = undefined;
    }

    describe("Test area (fixture)", function() {

      before(function() {
        initFixtures();
      });

      after(function() {
        deinitFixtures();
      });

      it("test area exists", function() {
        expect(test_area).to.exist;
      });
      it("region element exists", function() {
        expect(region_el).to.exist;
        expect(region_el).to.be.an.instanceof(HTMLElement_class);
      });
      it("dummy component element exists", function() {
        expect(comp_el).to.exist;
        expect(comp_el).to.be.an.instanceof(HTMLElement_class);
      });

    }); // end of fixtures

    describe("properties", function() {

      var crosshair_zone;

      before(function() {
        initFixtures();
        crosshair_zone = new CrosshairZone(dummy_parent_crosshair, dummy_component);
      });

      after(function() {
        deinitFixtures();
        crosshair_zone = undefined;
      });

      describe("_parent_crosshair", function() {

        it("should exist", function() {
          expect(crosshair_zone._parent_crosshair).to.exist;
        });
        it("should be correct value", function() {
          expect(crosshair_zone._parent_crosshair).to.equal(dummy_parent_crosshair);
        });

      });

      describe("_underlying_component", function() {

        it("should exist", function() {
          expect(crosshair_zone._underlying_component).to.exist;
        });
        it("should be correct value", function() {
          expect(crosshair_zone._underlying_component).to.equal(dummy_component);
        });

      });

      describe("name", function() {

        it("should exist", function() {
          expect(crosshair_zone.name).to.exist;
        });
        it("should be correct value", function() {
          expect(crosshair_zone.name).to.equal(EXPECTED_NAME);
        });

      });

    }); // end of properties

    describe("methods", function() {

      var crosshair_zone;

      beforeEach(function() {
        initFixtures();
        crosshair_zone = new CrosshairZone(dummy_parent_crosshair, dummy_component);
      });

      afterEach(function() {
        deinitFixtures();
        crosshair_zone = undefined;
      });

      describe("getEl()", function() {

        it("should exist", function() {
          expect(crosshair_zone.getEl).to.exist;
        });
        it("should return undefined (if not rendered)", function() {
          expect(crosshair_zone.getEl()).to.equal(undefined);
        });
        it("should return HTMLCanvasElement (if rendered)", function() {
          crosshair_zone.render();
          expect(crosshair_zone.getEl()).to.be.an.instanceof(HTMLCanvasElement_class);
        });

      });

      describe("getComponent()", function() {

        it("should exist", function() {
          expect(crosshair_zone.getComponent).to.exist;
        });
        it("should return correct value", function() {
          expect(crosshair_zone.getComponent()).to.equal(dummy_component);
        });

      });

      /*
      var canvas = window.document.createElement("CANVAS");
      canvas.className = "crosshair " + this.name;
      canvas.setAttribute("ch-zone-index", ""+zone_index+"");
      canvas.setAttribute("width", comp.getWidth());
      canvas.setAttribute("height", comp.getHeight());
      this._el = canvas;
      region_el.appendChild(canvas);
      */
      describe("render()", function() {

        it("should exist", function() {
          expect(crosshair_zone.render).to.exist;
        });

        it("should correctly create HTML", function() {
          // pre tests
          var region_child_nodes = region_el.childNodes;
          expect(region_child_nodes).to.have.lengthOf(1);
          crosshair_zone.render(ZONE_INDEX);
          // post tests
          expect(region_child_nodes).to.have.lengthOf(2);
          var crosshair_zone_node = region_child_nodes[1];
          expect(crosshair_zone_node).to.be.an.instanceof(HTMLCanvasElement_class);
          expect(crosshair_zone_node.className).to.equal(EXPECTED_CLASS_NAME);
          expect(crosshair_zone_node.getAttribute("ch-zone-index")).to.equal(""+ZONE_INDEX+"");
          expect(crosshair_zone_node.offsetHeight).to.equal(COMP_HEIGHT);
          expect(crosshair_zone_node.offsetWidth).to.equal(CHART_WIDTH);
        });

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
          crosshair_zone.setParentChart(dummy_parent_chart);
          expect(comp._parent_chart).to.equal(dummy_parent_chart);
        });

      });

      describe("destroy()", function() {

        it("should exist", function() {
          expect(comp.destroy).to.exist;
        });
        it("should undefine el property", function() {
          crosshair_zone.destroy();
          expect(comp.el).to.equal(undefined);
          expect(comp.getEl()).to.equal(undefined);
        });
        it("should empty region DIV element", function() {
          crosshair_zone.destroy();
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
          var layers_length = crosshair_zone.layers.length;
          crosshair_zone.addLayer(dummy_layer);
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
          crosshair_zone.addLayer(dummy_layer);
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
          crosshair_zone.removeLayers();
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.layers).to.have.lengthOf(0);
        });
        it("should empty populated layer array", function() {
          crosshair_zone.addLayer(dummy_layer);
          expect(comp.layers).to.have.lengthOf(1);
          crosshair_zone.removeLayers();
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.layers).to.have.lengthOf(0);
        });
        it("should leave layer specified as excluded", function() {
          crosshair_zone.addLayer(dummy_layer);
          expect(comp.layers).to.have.lengthOf(1);
          crosshair_zone.removeLayers([dummy_layer]);
          expect(comp.getAllLayers()).to.be.an("array");
          expect(comp.layers).to.have.lengthOf(1);
          expect(comp.layers[0]).to.equal(dummy_layer);
        });

      });
      */

    }); // end of methods

  });

};
