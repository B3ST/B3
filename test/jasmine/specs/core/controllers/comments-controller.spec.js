/* global define */

define([
  'controllers/comments-controller',
  'controllers/base-controller',
  'views/comments-view',
  'models/post-model'
], function (CommentsController, BaseController, CommentsView, Post) {
  'use strict';

  describe("CommentsController", function() {
    var controller, options;

    beforeEach(function() {
      var region = jasmine.createSpyObj('region', ['show']);
      options = { model: new Post({ meta: { links: { 'b3:replies': 'url' }}}), region: region };
    });

    it("should extend from BaseController", function() {
      expect(inherits(CommentsController, BaseController)).toBeTruthy();
    });

    describe(".showComments", function() {
      it("should display a loading bar", function() {
        var show = spyOn(CommentsController.prototype, 'show');

        controller = new CommentsController();
        controller.showComments(options);

        expect(show).toHaveBeenCalledWith(jasmine.any(CommentsView), { loading: true, region: options.region });
      });
    });
  });
});