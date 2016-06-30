"use strict";

var expect = require("chai").expect;
var test_data = require("../../test.data");
var VolumeLayer = require("../../../src/layer/indicator/VolumeLayer");

module.exports = function() {

  describe("DojiChart.core.VolumeLayer", function() {

    const CLASS_NAME = "component";
    const COMP_WIDTH = 50;
    const COMP_HEIGHT = 50;

    const OUTPUT = "volume";
    const MIN_VALUE = 0;
    const MAX_FIELD = OUTPUT;

    const BAR_COLOR = "blue";
    const BAR_WIDTH = 5;

    const DATA_OFFSET = 0;
    const DATA_COUNT = 3;

    const CONFIG = {
      barColor: BAR_COLOR,
      barWidth: BAR_WIDTH
    };

    var val_min = MIN_VALUE;
    var val_max = 260;
    var val_range = val_max - val_min;
    var px_height = COMP_HEIGHT;
    var px_padding_offset = 0;
    const DUMMY_valueToPixel = function(val) { return ((val - val_min) / val_range * px_height) - px_padding_offset; };
    const DUMMY_indexToPixel = function(indx) { return (indx * 8) + 8; };

    var HTMLCanvasElement_class = (window.document.createElement("canvas")).constructor; // a workaround to avoid jshint HTMLCanvasElement is undefined

    var test_area, canvas, dummy_comp, dummy_data;

    before(function() {
      test_area = window.document.getElementById("layer-test-area");
      //test_area.innerHTML = "";
      canvas = window.document.createElement("canvas");
      canvas.className = CLASS_NAME;
      canvas.setAttribute("width", COMP_WIDTH);
      canvas.setAttribute("height", COMP_HEIGHT);
      test_area.appendChild(canvas);
      dummy_comp = {
        getEl: function() {
          return canvas;
        },
        getContext: function() {
          return canvas.getContext("2d");
        },
        getWidth: function() {
          return COMP_WIDTH;
        },
        getDrawingWidth: function() {
          return COMP_WIDTH;
        },
        getHeight: function() {
          return COMP_HEIGHT;
        }
      };
      dummy_data = {
        getRawData: function() {
          return test_data;
        },
        getFieldMap: function() {
          return {
            time: "t",
            open: "o",
            high: "h",
            low: "l",
            close: "c",
            volume: "v"
          };
        }
      };
    });

    describe("canvas (fixture)", function() {

      it("exist", function() {
        expect(canvas).to.exist;
      });

      it("is a HTMLCanvasElement", function() {
        expect(canvas).to.be.an.instanceof(HTMLCanvasElement_class);
      });

      it("has correct width", function() {
        expect(canvas.width).to.equal(COMP_WIDTH);
      });

      it("has correct height", function() {
        expect(canvas.height).to.equal(COMP_HEIGHT);
      });

    }); // end of fixtures

    describe("properties", function() {

      var layer;

      beforeEach(function() {
        layer = new VolumeLayer(CONFIG);
        layer.setParentComponent(dummy_comp);
      });

      afterEach(function() {
        layer = undefined;
      });

      describe(".elements property", function() {
        it("should be empty array", function() {
          expect(layer.elements).to.be.an("array");
          expect(layer.elements).to.have.lengthOf(0);
        });
      });

      describe("._parent_component property", function() {
        it("should equal parent component instance", function() {
          expect(layer._parent_component).to.equal(dummy_comp);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var layer;

      beforeEach(function() {
        layer = new VolumeLayer(CONFIG);
        layer.setParentComponent(dummy_comp);
      });

      afterEach(function() {
        layer = undefined;
        for(var i = 0; i < test_data.length; i++)
        {
          delete test_data[i][OUTPUT];
        }
      });

      describe("getParentComponent()", function() {

        it("should exist", function() {
          expect(layer.getParentComponent).to.exist;
        });
        it("should return correct value", function() {
          expect(layer.getParentComponent()).to.equal(dummy_comp);
        });

      });

      describe("setParentComponent()", function() {

        it("should exist", function() {
          expect(layer.setParentComponent).to.exist;
        });
        it("should set parent component property", function() {
          layer.setParentComponent(dummy_comp);
          expect(layer._parent_component).to.equal(dummy_comp);
        });

      });

      describe("getWidth()", function() {

        it("should exist", function() {
          expect(layer.getWidth).to.exist;
        });
        it("should return correct value (" + COMP_WIDTH + ")", function() {
          expect(layer.getWidth()).to.equal(COMP_WIDTH);
        });

      });

      describe("getDrawingWidth()", function() {

        it("should exist", function() {
          expect(layer.getDrawingWidth).to.exist;
        });
        it("should return correct value (" + COMP_WIDTH + ")", function() {
          expect(layer.getDrawingWidth()).to.equal(COMP_WIDTH);
        });

      });

      describe("getHeight()", function() {

        it("should exist", function() {
          expect(layer.getHeight).to.exist;
        });
        it("should return correct value (" + COMP_HEIGHT + ")", function() {
          expect(layer.getHeight()).to.equal(COMP_HEIGHT);
        });

      });

      describe("getMinField()", function() {

        it("should exist", function() {
          expect(layer.getMinField).toexist;
        });
        it("should return undefined", function() {
          expect(layer.getMinField()).to.equal(undefined);
        });

      });

      describe("getMaxField()", function() {

        it("should exist", function() {
          expect(layer.getMaxField).to.exist;
        });
        it("should return correct value", function() {
          expect(layer.getMaxField()).to.equal(MAX_FIELD);
        });

      });

      describe("getMinValue()", function() {

        it("should exist", function() {
          expect(layer.getMinValue).to.exist;
        });
        it("should return 0", function() {
          expect(layer.getMinValue()).to.equal(MIN_VALUE);
        });

      });

      describe("getMaxValue()", function() {

        it("should exist", function() {
          expect(layer.getMaxValue).to.exist;
        });
        it("should return undefined", function() {
          expect(layer.getMaxValue()).to.equal(undefined);
        });

      });

      describe("getBarWidth()", function() {

        it("should exist", function() {
          expect(layer.getBarWidth).to.exist;
        });
        it("should return correct value", function() {
          expect(layer.getBarWidth()).to.equal(BAR_WIDTH);
        });

      });

      describe("setBarWidth()", function() {

        it("should exist", function() {
          expect(layer.setBarWidth).to.exist;
        });
        it("should return correct value", function() {
          layer.setBarWidth(BAR_WIDTH);
          expect(layer.barWidth).to.equal(BAR_WIDTH);
        });

      });

      describe("_getContext()", function() {

        it("should exist", function() {
          expect(layer._getContext).to.exist;
        });
        it("should return correct value", function() {
          expect(layer._getContext()).to.equal(canvas.getContext("2d"));
        });

      });

      describe("precompute()", function() {

        it("should exist", function() {
          expect(layer.precompute).to.not.exist;
        });

      });

      describe("draw()", function() {

        it("should exist", function() {
          expect(layer.draw).to.exist;
        });
        it("should add elements to elements property and draw to canvas", function() {
          expect(layer.elements).to.be.an("array");
          expect(layer.elements).to.have.lengthOf(0);
          layer.draw(dummy_data, DATA_COUNT, DATA_OFFSET, DUMMY_valueToPixel, DUMMY_indexToPixel);
          expect(layer.elements).to.be.an("array");
          expect(layer.elements).to.have.lengthOf(DATA_COUNT);
        });

      });

    }); // end of methods

  });

};
