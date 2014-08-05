/* global define */

define([
  'views/loading-view',
], function (LoadingView) {
  'use strict';

  describe("LoadingView", function() {
    describe(".show", function() {
      it("should display the loading view", function() {
        this.view = new LoadingView();
        this.view.render();
        this.view.show();
        expect(this.view.$el.attr('style')).toEqual('display: block;');
      });
    });

    describe(".hide", function() {
      it("should hide the loading view", function() {
        this.view = new LoadingView();
        this.view.render();
        this.view.hide();
        expect(this.view.$el.is(':visible')).toBeFalsy();
      });
    });
  });
});
