/* global define */

define([
  'backbone',
  'controllers/archive-controller',
  'controllers/base-controller',
  'buses/command-bus',
  'buses/event-bus',
  'buses/request-bus',
  'buses/navigator',
  'models/post-model',
  'models/settings-model',
  'models/user-model',
  'models/taxonomy-model',
  'collections/post-collection',
  'views/archive-view',
  'views/not-found-view',
  'sinon'
], function (Backbone, ArchiveController, BaseController, CommandBus, EventBus, RequestBus, Navigator, Post, Settings, User, Taxonomy, Posts, ArchiveView, NotFoundView) {
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

        'pagination:previous:page':      'showPage',
        'pagination:next:page':          'showPage',
        'pagination:select:page':        'showPage',

        'search:start':                  'saveCurrentState',
        'search:stop':                   'loadPreviousState',
        'search:results:found':          'displayResults',
        'search:results:not_found':      'displayResults'
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
        expect(show).toHaveBeenCalledWith(jasmine.any(ArchiveView), { loading: { done: jasmine.any(Function), fail: jasmine.any(Function) }});
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
          expect(showView).toHaveBeenCalledWith(10);
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

    xdescribe(".saveCurrentState", function() {
      it("should save the current displaying options", function() {
        var posts = new Posts();
        controller = new ArchiveController(options);

        controller.show(controller._archiveView(posts, null, jasmine.any(Object)));
        controller.saveCurrentState();

        expect(controller.state).toEqual({
          was_displaying: true,
          collection:     posts,
          page:           1,
          filter:         jasmine.any(Object)
        });
      });
    });

    xdescribe(".loadPreviousState", function() {
      beforeEach(function() {
        this.posts      = new Posts();
        this.appShow    = spyOn(app.main, 'show');
        this.controller = new ArchiveController({
          posts: this.posts,
          app:   app,
          user:  user
        });

        this.controller.state = {
          was_displaying: true,
          collection:     this.posts
        };

        this.controller.loadPreviousState();
      });

      it("should load the previous displaying options", function() {
        this.controller.posts = this.posts;
        this.controller.page  = 1;
      });

      it("should display the corresponding view", function() {
        var view = this.appShow.calls.mostRecent();
        expect(typeof view).toEqual('ArchiveView');
        expect(view.collection).toEqual(this.posts);
      });
    });

    xdescribe(".displayResults", function() {
      it("should display the given results", function() {
        this.posts      = new Posts();
        this.appShow    = spyOn(app.main, 'show');
        this.controller = new ArchiveController({
          posts: this.posts,
          app:   app,
          user:  user
        });

        this.controller.displayResults({results: this.posts, filter: null});

        var view = this.appShow.calls.mostRecent();
        expect(typeof view).toEqual('ArchiveView');
        expect(view.collection).toEqual(this.posts);
      });
    });

    xdescribe(".displayNotFound", function() {
      it("should display a not found view", function() {
        this.posts      = new Posts();
        this.appShow    = spyOn(app.main, 'show');
        this.controller = new ArchiveController({
          posts: this.posts,
          app:   app,
          user:  user
        });

        this.controller.displayResults();

        var view = this.appShow.calls.mostRecent();
        expect(typeof view).toEqual('NotFoundView');
      });
    });
  });
});