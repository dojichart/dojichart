"use strict";

var expect = require("chai").expect;
var Type = require("../../src/core/Type");

module.exports = function() {

  describe("DojiChart.core.Type", function() {

    var dummy_config = {
      a: "aaa",
      b: 5
    };

    describe("properties", function() {

      var type;

      beforeEach(function() {
        type = new Type(dummy_config);
      });

      afterEach(function() {
        type = undefined;
      });

      describe("._config property", function() {
        it("should have same properties as supplied config", function() {
          expect(type._config).to.have.all.keys(dummy_config);
        });
      });

    }); // end of properties

    describe("methods", function() {

      var type;

      beforeEach(function() {
        type = new Type(dummy_config);
      });

      afterEach(function() {
        type = undefined;
      });

      describe("getConfig()", function() {

        it("should exist", function() {
          expect(type.getConfig).to.exist;
        });
        it("should return correct value", function() {
          expect(type.getConfig()).to.have.all.keys(dummy_config);
        });

      });

    }); // end of methods

  });

};
