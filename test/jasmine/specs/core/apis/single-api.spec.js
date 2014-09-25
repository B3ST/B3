/* global define */

define([
  'apis/single-api',
  'controllers/single-controller'
], function (SingleAPI, SingleController) {
  'use strict';

  describe("SingleAPI", function() {
    var api;

    describe(".showPostBySlug", function() {
      it("should call showPost of SingleController", function() {
        var showPost = spyOn(SingleController.prototype, 'showSingle');
        api = new SingleAPI();

        api.showPostBySlug({ post: 'post' });
        expect(showPost).toHaveBeenCalled();
      });
    });
  });
});