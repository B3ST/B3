/* global define */

define([
  "views/footer-view"
], function (FooterView) {
  "use strict";

  describe("FooterView", function() {
    it("should be defined", function() {
      expect(new FooterView()).toBeDefined();
    });
  });
});