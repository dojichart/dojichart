"use strict";

var expect = require("chai").expect;
var Element = require("../../src/element/Element");

module.exports = function() {

  describe("DojiChart.element.Element", function() {

    describe("constructor", function() {

      var element = new Element();

      it("should be defined", function() {
        expect(element).to.be.an.instanceof(Element);
      });

    }); // end of properties

  });

};
