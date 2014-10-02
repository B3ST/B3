/* global define */

define([
  "controllers/footer-controller",
  "controllers/base-controller",
  "views/footer-view"
], function (FooterController, BaseController, FooterView) {
  "use strict";

  describe("FooterController", function() {
    var controller;

    it("should extend from BaseController", function() {
      expect(inherits(FooterController, BaseController)).toBeTruthy();
    });

    describe(".showFooter", function() {
      it("should display a FooterView", function() {
        var show = spyOn(FooterController.prototype, "show");

        controller = new FooterController();
        controller.showFooter();

        expect(show).toHaveBeenCalledWith(jasmine.any(FooterView));
      });
    });
  });
});