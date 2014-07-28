/* global define */

define([
  'collections/widget-collection'
], function (Widgets) {
  'use strict';

  describe("Widgets", function() {
    beforeEach(function() {
      this.widgets = new Widgets();
    });

    it("should be defined", function() {
      expect(this.widgets).toBeDefined();
    });
  });
});