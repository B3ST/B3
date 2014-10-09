/* global define */

define([
  'controllers/single-controller',
  'controllers/base-controller',
  'models/post-model',
  'buses/navigator'
], function (SingleController, BaseController, Post, Navigator) {
  'use strict';

  describe("SingleController", function() {
    var controller;

    it("should extend from BaseController", function() {
      expect(inherits(SingleController, BaseController)).toBeTruthy();
    });

    it("should bind to a given set of events", function() {
      controller = new SingleController();
      expect(controller.busEvents).toEqual({
        'single:view:display:category': 'showTaxonomy',
        'single:view:display:tag':      'showTaxonomy',
        'single:view:display:author':   'showAuthor',
        'single:view:display:page':     'showPage',

        'pagination:next:page':         'showPageContent',
        'pagination:previous:page':     'showPageContent',
        'pagination:select:page':       'showPageContent'
      });
    });

    it("should have a set of child controller", function() {
      controller = new SingleController();
      expect(controller.childControllers).toEqual({
        pagination: 'paginationController',
        comments:   'commentsController'
      });
    });

    describe(".showSingle", function() {
      var show, post

      beforeEach(function() {
        show = spyOn(SingleController.prototype, 'show');
        post = new Post();

        controller = new SingleController({ model: post, template: '' });
      });

      it("should display loading", function() {
        controller.showSingle();
        expect(show).toHaveBeenCalledWith(null, {
          loading: {
            entities: [post],
            done: jasmine.any(Function),
            fail: jasmine.any(Function)
          }
        });
      });
    });

    describe(".showPageContent", function() {
      it("should change the content of the model", function() {
        var post = new Post({ content: 'page1<!--nextpage-->page2<!--nextpage-->page3'}),
            split = post.get('content').split(/<!--nextpage-->/),
            set   = spyOn(post, 'set');

        controller = new SingleController({ model: post, template: '', splitContent: split });
        controller.showPageContent({ page: 2 });

        expect(set).toHaveBeenCalledWith({ content: split[1] });
      });
    });

    using('Taxonomy values', ['category', 'post_tag'], function (value) {
      describe(".showTaxonomy", function() {
        it("should navigate to the given taxonomy", function() {
          var navigate = spyOn(Navigator, 'navigateToTaxonomy');

          controller = new SingleController({ template: '' });
          controller.showTaxonomy({ type: value, slug: 'slug' });

          expect(navigate).toHaveBeenCalledWith(value, 'slug', 1, true);
        });
      });
    });

    describe(".showAuthor", function() {
      it("should navigate to the given author", function() {
        var navigate = spyOn(Navigator, 'navigateToAuthor');

        controller = new SingleController({ template: '' });
        controller.showAuthor({ type: 'author', slug: 'slug' });

        expect(navigate).toHaveBeenCalledWith('slug', 1, true);
      });
    });
  });
});
