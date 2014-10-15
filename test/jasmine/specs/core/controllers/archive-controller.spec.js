/* global define */

define([
  'backbone',
  'controllers/archive-controller',
  'controllers/base-controller',
  'views/archive-view',
  'buses/event-bus',
  'buses/navigator',
  'collections/post-collection',
  'models/post-model',
  'models/user-model'
], function (Backbone, ArchiveController, BaseController, ArchiveView, EventBus, Navigator, Posts, Post, User) {
  'use strict';

  describe("ArchiveController", function() {
    var app, controller, options, user, region;

    beforeEach(function() {
      var post = new Post({ID: 1, slug: 'post'});
      user    = new User({ID: 1, email: 'email', name: 'name'}),
      region  = jasmine.createSpyObj('region', ['show']);
      options = { region: region };
    });

    it("should inherit from BaseController", function() {
      expect(inherits(ArchiveController, BaseController)).toBeTruthy();
    });

    it("should bind to a given set of events", function() {
      controller = new ArchiveController({});
      expect(controller.busEvents).toEqual({
        'archive:show':                  'showArchive',

        'archive:view:display:post':     'showPost',
        'archive:view:display:category': 'showPostsByTaxonomy',
        'archive:view:display:tag':      'showPostsByTaxonomy',
        'archive:view:display:author':   'showPostsByAuthor',
        'archive:view:link:clicked':     'navigateToLink',

        'pagination:previous:page':      'showPage',
        'pagination:next:page':          'showPage',
        'pagination:select:page':        'showPage'
      });
    });

    it("should have a set of child controllers", function() {
      controller = new ArchiveController({});
      expect(controller.childControllers).toEqual({
        pagination: 'paginationController'
      });
    });

    describe(".showArchive", function() {
      var server, bus, posts, show;

      beforeEach(function() {
        show = spyOn(ArchiveController.prototype, 'show');
        controller = new ArchiveController(options);
      });

      it("should request all posts", function() {
        controller.showArchive();
        expect(show).toHaveBeenCalledWith(null, {
          loading: {
            entities: [controller.posts],
            done: jasmine.any(Function),
            fail: jasmine.any(Function)
          }
        });
      });

      describe("When fetching is successful", function() {
        var showView;
        beforeEach(function() {
          showView = spyOn(ArchiveController.prototype, 'showView');
          show.and.callFake(function (view, options) {
            var jqXHR = jasmine.createSpyObj('jqXHR', ['getResponseHeader']);
            jqXHR.getResponseHeader.and.callFake(function () {
              return "10";
            });
            options.loading.done([], "", jqXHR);
          });

          controller = new ArchiveController(options);
          controller.showArchive();
        });

        it("should show the archive view", function() {
          expect(showView).toHaveBeenCalledWith(10, {});
        });
      });
    });

    describe(".showPage", function() {
      var show;

      beforeEach(function() {
        show = spyOn(ArchiveController.prototype, "show");
        controller = new ArchiveController(options);
      });

      it("should request all posts", function() {
        controller.showPage({ page: 2 });
        expect(show).toHaveBeenCalledWith(null, {
          loading: {
            style: "opacity",
            entities: [controller.posts],
            done: jasmine.any(Function),
            fail: jasmine.any(Function)
          }
        });
      });

      describe("When fetching is successful", function() {
        it("should navigate to the second page", function() {
          var navigate = spyOn(Navigator, 'navigate');
          Backbone.history.fragment = '/wordpress/page/1';
          show.and.callFake(function (view, options) {
            options.loading.done();
          });

          controller.showPage({ page: 2 });
          expect(navigate).toHaveBeenCalledWith('/wordpress/page/2', false);
        });
      });
    });

    using('Taxonomy types', ['category', 'post_tag', 'author'], function (type) {
      describe(".showPostsByTaxonomy", function() {
        it("should navigate to the category taxonomy", function() {
          var navigate = spyOn(Navigator, 'navigateToTaxonomy');
          controller = new ArchiveController(options);

          controller.showPostsByTaxonomy({ slug: 'slug', type: type });
          expect(navigate).toHaveBeenCalledWith(type, 'slug', 1, true);
        });
      });
    });

    describe(".showPost", function() {
      it("should navigate to the given post", function() {
        var navigate = spyOn(Navigator, 'navigateToPost');
        controller = new ArchiveController(options);

        controller.showPost({ post: 'post' });
        expect(navigate).toHaveBeenCalledWith('post', 1, true);
      });
    });

    describe(".showPostByAuthor", function() {
      it("should navigate to the author's posts", function() {
        var navigate = spyOn(Navigator, 'navigateToAuthor');
        controller = new ArchiveController(options);

        controller.showPostsByAuthor({ slug: 'author' });
        expect(navigate).toHaveBeenCalledWith('author', 1, true);
      });
    });

    describe("When triggering search:term", function() {
      it("should fetch the new posts", function() {
        var show = spyOn(ArchiveController.prototype, 'show');

        controller = new ArchiveController(options);
        controller.triggerMethod('search:term');

        expect(show).toHaveBeenCalledWith(null, {
          loading: {
            style: "opacity",
            entities: [jasmine.any(Posts)]
          }
        });
      });
    });

    describe(".navigateToLink", function() {
      it("should call navigateToLink of Navigator", function() {
        var navigate = spyOn(Navigator, 'navigateToLink');

        controller = new ArchiveController(options);
        controller.navigateToLink({ href: 'link' });

        expect(navigate).toHaveBeenCalledWith('link', true);
      });
    });
  });
});