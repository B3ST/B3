/* global define */

define([
  'views/loading-view',
], function (LoadingView) {
  'use strict';

  describe("LoadingView", function() {
    it("should be defined", function() {
      this.view = new LoadingView();
      expect(this.view).toBeDefined();
    });
  });
});
