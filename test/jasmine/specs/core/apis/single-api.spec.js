/* global define */

define([
  'apis/single-api',
  'controllers/single-controller'
], function (SingleAPI, SingleController) {
  'use strict';

  describe("SingleAPI", function() {
    var api;

    describe(".showPostBySlug", function() {
      it("should call showSingle of SingleController", function() {
        var showSingle = spyOn(SingleController.prototype, 'showSingle');
        api = new SingleAPI();

        api.showPostBySlug({ post: 'post' });
        expect(showSingle).toHaveBeenCalled();
      });
    });

    describe(".showPageBySlug", function() {
      it("should call showSingle of SingleController", function() {
        var showSingle = spyOn(SingleController.prototype, 'showSingle');
        api = new SingleAPI();

        api.showPageBySlug({ post: 'post' });
        expect(showSingle).toHaveBeenCalled();
      });
    });
  });
});