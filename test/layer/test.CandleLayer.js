"use strict";

var expect = require("chai").expect;
var test_data = require("../test.data");
var CandleLayer = require("../../src/layer/CandleLayer");

module.exports = function() {

  describe("DojiChart.core.CandleLayer", function() {

    const CLASS_NAME = "component";
    const COMP_WIDTH = 100;
    const COMP_HEIGHT = 50;
    const MIN_FIELD = "low";
    const MAX_FIELD = "high";

    const BEAR_BODY_COLOR = "red";
    const BULL_BODY_COLOR = "green";
    const WICK_COLOR = "black";
    const CANDLE_BODY_WIDTH = 5;
    const CANDLE_WICK_WIDTH = 1;

    const DATA_OFFSET = 0;
    const DATA_COUNT = 3;

    const CONFIG = {
      bearBodyColor: BEAR_BODY_COLOR,
      bullBodyColor: BULL_BODY_COLOR,
      wickColor: WICK_COLOR,
      candleBodyWidth: CANDLE_BODY_WIDTH,
      candleWickWidth: CANDLE_WICK_WIDTH
    };

    var val_min = 1.06851;
    var val_max = 1.06923;
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
            close: "c"
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
        layer = new CandleLayer(CONFIG);
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
        layer = new CandleLayer(CONFIG);
        layer.setParentComponent(dummy_comp);
      });

      afterEach(function() {
        layer = undefined;
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
          expect(layer.getMinField).to.exist;
        });
        it("should return correct value", function() {
          expect(layer.getMinField()).to.equal(MIN_FIELD);
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

      describe("_getContext()", function() {

        it("should exist", function() {
          expect(layer._getContext).to.exist;
        });
        it("should return correct value", function() {
          expect(layer._getContext()).to.equal(canvas.getContext("2d"));
        });

      });

      describe("getCandleBodyWidth()", function() {

        it("should exist", function() {
          expect(layer.getCandleBodyWidth).to.exist;
        });
        it("should return correct value", function() {
          expect(layer.getCandleBodyWidth()).to.equal(CANDLE_BODY_WIDTH);
        });

      });

      describe("setCandleBodyWidth()", function() {

        it("should exist", function() {
          expect(layer.setCandleBodyWidth).to.exist;
        });
        it("should return correct value", function() {
          layer.setCandleBodyWidth(CANDLE_BODY_WIDTH);
          expect(layer.candleBodyWidth).to.equal(CANDLE_BODY_WIDTH);
        });

      });

      describe("getBearBodyColor()", function() {

        it("should exist", function() {
          expect(layer.getBearBodyColor).to.exist;
        });
        it("should return correct value", function() {
          expect(layer.getBearBodyColor()).to.equal(BEAR_BODY_COLOR);
        });

      });

      describe("setBearBodyColor()", function() {

        it("should exist", function() {
          expect(layer.setBearBodyColor).to.exist;
        });
        it("should return correct value", function() {
          layer.setBearBodyColor(BEAR_BODY_COLOR);
          expect(layer.bearBodyColor).to.equal(BEAR_BODY_COLOR);
        });

      });

      describe("getBullBodyColor()", function() {

        it("should exist", function() {
          expect(layer.getBullBodyColor).to.exist;
        });
        it("should return correct value", function() {
          expect(layer.getBullBodyColor()).to.equal(BULL_BODY_COLOR);
        });

      });

      describe("setBullBodyColor()", function() {

        it("should exist", function() {
          expect(layer.setBullBodyColor).to.exist;
        });
        it("should return correct value", function() {
          layer.setBullBodyColor(BULL_BODY_COLOR);
          expect(layer.bullBodyColor).to.equal(BULL_BODY_COLOR);
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
